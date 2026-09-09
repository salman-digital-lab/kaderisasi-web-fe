import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { instant } from "@next/playwright";

const routes = [
  {
    path: "/activity",
    heading: "Ayo Daftar Kegiatan di Kaderisasi Salman",
    menu: "Kegiatan",
    content: "Kegiatan uji 1",
  },
  {
    path: "/clubs",
    heading: "Klub di Kaderisasi Salman",
    menu: "Klub",
    content: "Klub uji 1",
  },
  {
    path: "/consultation",
    heading: "Ruang Curhat Kaderisasi Salman",
    menu: "Ruang Curhat",
    content:
      "Silahkan masuk ke akun anda terlebih dahulu untuk menggunakan layanan Ruang Curhat",
  },
];

async function menuLink(page: Page, name: string): Promise<Locator> {
  if ((page.viewportSize()?.width ?? 1280) < 992) {
    await page.getByRole("button", { name: "Buka menu", exact: true }).click();
    return page.getByRole("dialog").getByRole("link", { name, exact: true });
  }
  return page.locator("header").getByRole("link", { name, exact: true });
}

for (const route of routes) {
  test(`initial load ${route.path}`, async ({ page, baseURL }, testInfo) => {
    await instant(
      page,
      async () => {
        await page.goto(route.path);
        await expect(
          page.getByRole("heading", { name: route.heading, exact: true }),
        ).toBeVisible();
        await expect(
          page
            .locator("header")
            .getByRole("img", { name: "bmka", exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText(route.content, { exact: true }),
        ).toHaveCount(0);
        await page.screenshot({
          path: testInfo.outputPath("initial-shell.png"),
        });
      },
      { baseURL },
    );
    // The locked document is complete; a reload requests an unlocked document.
    await page.reload();
    await expect(page.getByText(route.content, { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("resolved.png") });
  });

  test(`menu navigation ${route.path}`, async ({ page }, testInfo) => {
    await page.goto("/privacy-policy");
    const link = await menuLink(page, route.menu);
    let documentRequests = 0;
    page.on("request", (request) => {
      if (
        request.isNavigationRequest() &&
        request.resourceType() === "document"
      )
        documentRequests++;
    });
    await instant(page, async () => {
      await link.click();
      await expect(page).toHaveURL(route.path);
      await expect(
        page.getByRole("heading", { name: route.heading, exact: true }),
      ).toBeVisible();
      await expect(page.getByText(route.content, { exact: true })).toHaveCount(
        0,
      );
      expect(documentRequests).toBe(0);
      await page.screenshot({
        path: testInfo.outputPath("navigation-shell.png"),
      });
    });
    await expect(page.getByText(route.content, { exact: true })).toBeVisible();
  });
}

test("activity pagination stays in sync with URL and browser history", async ({
  page,
}) => {
  await page.goto("/activity?page=2");
  await expect(
    page.getByRole("button", { name: "2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Kegiatan uji 9", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "1", exact: true }).click();
  await expect(page).toHaveURL("/activity?page=1");
  await expect(
    page.getByRole("button", { name: "1", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Kegiatan uji 9", { exact: true })).toBeVisible();
});

test("club search, paging, history and empty state", async ({ page }) => {
  await page.goto("/clubs");
  await page
    .getByRole("link", { name: "Halaman berikutnya", exact: true })
    .click();
  await expect(page).toHaveURL("/clubs?page=2");
  await expect(page.getByText("Klub uji 13", { exact: true })).toBeVisible();
  await page
    .getByRole("textbox", { name: "Cari klub", exact: true })
    .fill("tidak-ada");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(page).toHaveURL(/search=tidak-ada/);
  await expect(
    page.getByText(
      "Tidak ada klub yang sesuai dengan pencarian atau filter Anda.",
    ),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("textbox", { name: "Cari klub", exact: true }),
  ).toHaveValue("");
  await expect(page.getByText("Klub uji 13", { exact: true })).toBeVisible();
  await page.goto("/clubs?page=999");
  await expect(page).toHaveURL("/clubs?page=2");
});

test("consultation still requires login to register", async ({ page }) => {
  await page.goto("/consultation");
  const login = page
    .getByTestId("consultation-content")
    .getByRole("link", { name: "Masuk", exact: true });
  await expect(login).toHaveAttribute(
    "href",
    "/login?redirect=http://localhost:3000/consultation",
  );
  await expect(page.getByRole("textbox")).toHaveCount(0);
});

test("leaderboard stays hidden in navigation", async ({ page }) => {
  await page.goto("/privacy-policy");
  await menuLink(page, "Kegiatan");
  await expect(
    page.locator(
      'header a[href="/leaderboard"], [role="dialog"] a[href="/leaderboard"]',
    ),
  ).toHaveCount(0);
});

for (const path of ["/", "/privacy-policy", "/terms-of-service"]) {
  test(`branding content is public without JavaScript ${path}`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${baseURL}${path}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByText("Memuat halaman…", { exact: true }),
    ).toHaveCount(0);
    await context.close();
  });
}
