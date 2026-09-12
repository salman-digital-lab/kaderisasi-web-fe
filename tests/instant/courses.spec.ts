import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";
import type { BrowserContext } from "@playwright/test";
import type { AxeResults } from "axe-core";

const require = createRequire(`${process.cwd()}/package.json`);
async function signIn(
  context: BrowserContext,
  token = "ui-preview",
): Promise<void> {
  await context.addCookies([
    { name: "session", value: token, url: "http://localhost:3000" },
  ]);
}

test("Kelas matches catalog controls and shows accessible personal progress", async ({
  page,
  context,
}, testInfo) => {
  await signIn(context);
  const styles = [];
  for (const route of ["/clubs", "/kelas"]) {
    await page.goto(route);
    await expect(page.getByRole("article").first()).toBeVisible();
    styles.push(
      await page.getByRole("search").evaluate((element) => {
        const field = element.querySelector("input")!;
        const button = element.querySelector("button")!;
        const card = document.querySelector("article")!;
        const heading = document.querySelector("main h1")!;
        const css = getComputedStyle(button);
        return {
          width: element.getBoundingClientRect().width,
          fieldHeight: field.getBoundingClientRect().height,
          buttonHeight: button.getBoundingClientRect().height,
          buttonColor: css.backgroundColor,
          buttonFont: css.font,
          cardWidth: card.getBoundingClientRect().width,
          cardRadius: getComputedStyle(card).borderRadius,
          headingFont: getComputedStyle(heading).font,
          heroSpacing: getComputedStyle(
            heading.closest("header")!.firstElementChild!,
          ).padding,
        };
      }),
    );
    await page.screenshot({
      path: testInfo.outputPath(`${route.slice(1)}.png`),
      fullPage: true,
    });
  }
  expect(styles[0]).toEqual(styles[1]);
  await expect(page.getByRole("article")).toHaveCount(12);
  const cards = page.getByRole("article");
  await expect(cards.nth(0)).toContainText("Belum dimulai");
  await expect(cards.nth(1)).toContainText("Sedang dipelajari");
  await expect(cards.nth(1).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  await expect(cards.nth(2)).toContainText("Selesai");
  await expect(cards.nth(3)).toContainText("Sedang dipelajari");
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const violations = await page.evaluate(async () => {
    const win = window as typeof window & {
      axe: { run: (context: Element, options: object) => Promise<AxeResults> };
    };
    const results = await win.axe.run(document.querySelector("main")!, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    return results.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    }));
  });
  expect(violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("Kelas search, reset, pagination, and course navigation work with the keyboard", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/kelas?page=2");
  const search = page.getByRole("textbox", { name: "Cari kelas" });
  await search.fill("Kelas uji 2");
  await search.press("Tab");
  await expect(
    page.getByRole("button", { name: "Cari", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/kelas\?search=Kelas\+uji\+2$/);
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByRole("link", { name: "Hapus pencarian" }).click();
  await expect(page.getByRole("textbox", { name: "Cari kelas" })).toHaveValue(
    "",
  );
  await page.getByRole("link", { name: "Halaman berikutnya" }).click();
  await expect(
    page.getByRole("heading", { name: "Kelas uji 13", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Halaman sebelumnya" }).click();
  await page
    .getByRole("link", { name: "Buka kelas Kelas uji 2", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Lanjutkan belajar" }),
  ).toHaveAttribute("href", "/kelas/2/materi/2");
  await page.getByRole("link", { name: "Semua kelas" }).click();
  await search.fill("Tidak ada hasil uji");
  await search.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Kelas tidak ditemukan" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Tampilkan semua kelas" }).click();
  await expect(search).toHaveValue("");
  await page.goto("/kelas?page=999");
  await expect(page).toHaveURL(/\/kelas\?page=2$/);
});

test("Kelas empty, retry, and guest return states remain usable", async ({
  page,
  context,
}) => {
  await signIn(context, "ui-empty");
  await page.goto("/kelas");
  await expect(
    page.getByRole("heading", { name: "Belum ada kelas untuk Anda" }),
  ).toBeVisible();
  await signIn(context, `profile-course-error-${randomUUID()}`);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Kelas belum dapat dimuat" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Coba kembali" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
  await context.clearCookies();
  await page.goto("/kelas?search=video&page=2");
  await expect(page).toHaveURL(
    /\/login\?redirect=%2Fkelas%3Fsearch%3Dvideo%26page%3D2$/,
  );
  await expect(page.getByRole("article")).toHaveCount(0);
});
