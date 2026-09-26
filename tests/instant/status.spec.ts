import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";
import type { AxeResults } from "axe-core";

const require = createRequire(`${process.cwd()}/package.json`);

async function expectNoOverflow(page: Page): Promise<void> {
  const layout = await page.evaluate(() => ({
    fits: document.documentElement.scrollWidth <= innerWidth + 1,
    offenders: [...document.querySelectorAll("body *")]
      .filter(
        (element) => element.getBoundingClientRect().right > innerWidth + 1,
      )
      .slice(0, 8)
      .map((element) => ({
        tag: element.tagName,
        class: element.getAttribute("class"),
        text: element.textContent?.slice(0, 80),
        right: element.getBoundingClientRect().right,
      })),
  }));
  expect(layout.fits, JSON.stringify(layout.offenders)).toBe(true);
}

async function signIn(context: BrowserContext, mode = "review"): Promise<void> {
  await context.addCookies([
    {
      name: "session",
      value: `profile-status-${mode}-${randomUUID()}`,
      url: "http://localhost:3000",
    },
  ]);
}

async function filter(page: Page, label: string): Promise<void> {
  await page.getByRole("combobox", { name: "Status kegiatan" }).click();
  await page.getByRole("option", { name: label, exact: true }).click();
}

async function axe(page: Page): Promise<void> {
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const violations = await page.evaluate(async () => {
    const win = window as typeof window & {
      axe: { run: (context: Element, options: object) => Promise<AxeResults> };
    };
    const result = await win.axe.run(document.querySelector("main")!, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    return result.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    }));
  });
  expect(violations).toEqual([]);
}

test("newest registrations, exact status filters, trimmed search and pagination", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/status");
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText(/^1\. Pelatihan/);
  await page
    .getByRole("button", { name: "Halaman berikutnya", exact: true })
    .click();
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText(/^7\. Pelatihan/);
  await expect(
    page.getByRole("heading", { name: "14 pendaftaran" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Halaman berikutnya", exact: true })
    .click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText(/^14\. Pelatihan/);
  await expect(
    page.getByText("Dalam peninjauan", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Tanggal pendaftaran belum tersedia", { exact: true }),
  ).toHaveCount(2);
  await filter(page, "Diterima");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText("Diterima", { exact: true }),
  ).toBeVisible();
  const searched = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname === "/api/profile-history/activities" &&
      url.searchParams.get("search") === "SALMAN"
    );
  });
  await page.getByLabel("Cari kegiatan", { exact: true }).fill("  SALMAN  ");
  const searchResponse = await searched;
  expect(new URL(searchResponse.url()).searchParams.get("search_scope")).toBe(
    "name",
  );
  expect(new URL(searchResponse.url()).searchParams.get("per_page")).toBe("6");
  expect(searchResponse.headers()["cache-control"]).toContain("no-store");
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByLabel("Cari kegiatan", { exact: true }).fill("tidak ada");
  await expect(
    page.getByText("Tidak ada kegiatan yang sesuai", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hapus filter" }).click();
  await expect(page.getByLabel("Cari kegiatan", { exact: true })).toBeFocused();
  await expect(page.getByRole("article")).toHaveCount(6);
  for (const [label, count] of [
    ["Terdaftar", 1],
    ["Tidak diterima", 1],
    ["Tidak lulus", 1],
    ["Lulus kegiatan", 5],
    ["Belum diumumkan", 3],
    ["Belum terdaftar", 1],
  ] as const) {
    await filter(page, label);
    await expect(page.getByRole("article")).toHaveCount(count);
    await expect(
      page.getByRole("article").first().getByText(label, { exact: true }),
    ).toBeVisible();
  }
});

test("announcements remain withheld and certificate lifecycle links are preserved", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/status");
  await filter(page, "Belum diumumkan");
  await expect(
    page.getByText(/Jadwal pengumuman:.*1 Desember 2099.*15.00 WIB/),
  ).toBeVisible();
  await expect(
    page.getByText("Jadwal pengumuman belum tersedia.", { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /sertifikat|penerbitan/i }),
  ).toHaveCount(0);
  await filter(page, "Lulus kegiatan");
  for (const [name, href] of [
    ["Lihat Sertifikat:", "/certificate/CERT-UI"],
    ["Sertifikat Dicabut:", "/certificate/CERT-REVOKED"],
    ["Menunggu Penerbitan:", "/certificate/8"],
    ["Cek Sertifikat:", "/certificate/10"],
  ] as const) {
    await expect(
      page.getByRole("link", { name: new RegExp(`^${name}`) }),
    ).toHaveAttribute("href", href);
  }
  await expect(
    page
      .getByRole("article")
      .filter({ has: page.getByRole("heading", { name: /^9\. / }) })
      .getByRole("link"),
  ).toHaveCount(1);
  await axe(page);
  await page.getByRole("link", { name: /^Lihat Sertifikat:/ }).click();
  await expect(page).toHaveURL(/\/certificate\/CERT-UI$/);
  await expect(
    page.getByRole("heading", {
      name: "Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/status");
  await page
    .getByRole("link", { name: /^Detail kegiatan/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/activity\/kegiatan-uji-1$/);
});

test("empty state, retry after failure, and expired or absent session", async ({
  page,
  context,
}) => {
  await signIn(context, "empty");
  await page.goto("/status");
  await expect(
    page.getByRole("heading", { name: "Belum ada kegiatan terdaftar" }),
  ).toBeVisible();
  await axe(page);
  await page.getByRole("link", { name: "Cari kegiatan", exact: true }).click();
  await expect(page).toHaveURL(/\/activity$/);
  await signIn(context, "error-activities");
  await page.goto("/status");
  await expect(page.getByRole("alert")).toBeVisible();
  await axe(page);
  await page.getByRole("button", { name: "Coba lagi" }).click();
  await expect(page.getByRole("article")).toHaveCount(6);
  await signIn(context, "expired");
  await page.goto("/status");
  await expect(page).toHaveURL(/\/login\?redirect=(?:\/|%2F)status$/);
  expect((await context.cookies()).some(({ name }) => name === "session")).toBe(
    false,
  );
  await page.goto("/status");
  await expect(page).toHaveURL(/\/login\?redirect=(?:\/|%2F)status$/);
});

test("slow data shows the status skeleton", async ({ page, context }) => {
  await signIn(context, "slow");
  await page.goto("/status", { waitUntil: "commit" });
  await expect(
    page
      .getByText("Memuat status kegiatan...", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);
});

test("mobile and desktop reflow, first result visibility, touch targets and accessibility", async ({
  page,
  context,
}, testInfo) => {
  await signIn(context);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of testInfo.project.name === "mobile"
    ? [320, 390]
    : [768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/status");
    await expect(page.getByRole("article")).toHaveCount(6);
    await expectNoOverflow(page);
    const firstCard = page.getByRole("article").first();
    const statusBox = await firstCard
      .getByText("Diterima", { exact: true })
      .boundingBox();
    expect(statusBox!.y + statusBox!.height).toBeLessThan(844);
    const actions = await page.locator("main").getByRole("link").all();
    for (const action of actions) {
      const box = await action.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
    await axe(page);
    await page.screenshot({
      path: testInfo.outputPath(`status-${width}.png`),
      fullPage: true,
    });
    if (width === 390) {
      await expect(
        page.getByText("Halaman 1 dari 3", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Halaman 1", exact: true }),
      ).toBeHidden();
    }
    await page.goto("/profile?tab=activity");
    await expect(
      page.getByRole("tab", { name: "Kegiatan", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.screenshot({
      path: testInfo.outputPath(`profile-${width}.png`),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("keyboard controls, text resize and zoom-equivalent reflow remain usable", async ({
  page,
  context,
}, testInfo) => {
  await signIn(context);
  await page.goto("/status");
  const search = page.getByLabel("Cari kegiatan", { exact: true });
  await search.focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("combobox", { name: "Status kegiatan" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "Semua status", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ArrowUp");
  await expect(
    page.getByRole("option", { name: "Belum diumumkan", exact: true }),
  ).toHaveAttribute("data-combobox-selected", "true");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Hapus filter" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Hapus filter" }),
  ).toBeFocused();
  expect(
    await page
      .getByRole("button", { name: "Hapus filter" })
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(search).toBeFocused();
  if (testInfo.project.name === "desktop") {
    // A 1280px desktop at 200% browser zoom has a 640px CSS viewport.
    await page.setViewportSize({ width: 640, height: 400 });
  } else {
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  }
  await expectNoOverflow(page);
  await expect(
    page.getByRole("article").first().getByRole("link"),
  ).toBeVisible();
});

test("pagination clamps when registrations disappear between requests", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/status");
  await expect(page.getByRole("article")).toHaveCount(6);
  let clamped = false;
  await page.route("**/api/profile-history/activities?**", async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("page") === "2") {
      clamped = true;
      await route.fulfill({
        json: {
          data: {
            items: [],
            meta: { total: 1, current_page: 2, per_page: 6, last_page: 1 },
            summary: { total: 1, accepted: 1, rejected: 0, pending: 0 },
          },
        },
      });
    } else await route.continue();
  });
  await page
    .getByRole("button", { name: "Halaman berikutnya", exact: true })
    .click();
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText(/^1\. Pelatihan/);
  await expect.poll(() => clamped).toBe(true);
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "14 pendaftaran" }),
  ).toBeFocused();
});
