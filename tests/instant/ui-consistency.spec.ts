import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";
import type { AxeResults } from "axe-core";
import { UI_PAGES } from "../ui/pages";

const require = createRequire(`${process.cwd()}/package.json`);

for (const route of UI_PAGES) {
  test(`layout and accessibility: ${route.name}`, async ({
    page,
    context,
    baseURL,
  }, testInfo) => {
    if ("session" in route) {
      await context.addCookies([
        { name: "session", value: route.session, url: baseURL! },
      ]);
    }
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.locator("#main-content")).toHaveCount(1);
    await expect(page.locator("a button, button a")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);

    await page.addScriptTag({ path: require.resolve("axe-core") });
    const violations = await page.evaluate(async () => {
      const browserWindow = window as typeof window & {
        axe: {
          run: (context: Document, options: object) => Promise<AxeResults>;
        };
      };
      const results = await browserWindow.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      });
      return results.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      }));
    });
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${route.name}.png`) });
  });
}

test("skip link and menu are keyboard accessible", async ({ page }) => {
  await page.goto("/clubs");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Lewati ke konten utama" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  if ((page.viewportSize()?.width ?? 1280) < 992) {
    const burger = page.getByRole("button", { name: "Buka menu", exact: true });
    await burger.click();
    await expect(
      page.getByRole("dialog", { name: "Menu navigasi" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(burger).toBeFocused();
  } else {
    await expect(
      page
        .getByRole("navigation", { name: "Navigasi utama" })
        .getByRole("link", { name: "Klub", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  }
});

test("activity search resets pagination and follows browser history", async ({
  page,
}) => {
  await page.goto("/activity?page=2");
  await page.getByRole("textbox", { name: "Cari kegiatan" }).fill("tidak-ada");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(page.getByText("Tidak ada kegiatan yang sesuai.")).toBeVisible();
  expect(new URL(page.url()).searchParams.has("page")).toBe(false);
  await page.goBack();
  await expect(
    page.getByRole("textbox", { name: "Cari kegiatan" }),
  ).toHaveValue("");
  await expect(page.getByText("Kegiatan uji 9", { exact: true })).toBeVisible();
});
