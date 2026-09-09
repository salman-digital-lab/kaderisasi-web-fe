import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function controlStyle(locator: Locator): Promise<object> {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      font: style.font,
      color: style.color,
      background: style.backgroundColor,
      radius: style.borderRadius,
      padding: style.padding,
    };
  });
}

test("activity and club catalogues have matching controls and card structure", async ({
  page,
}, testInfo) => {
  const comparisons = [];
  for (const route of ["/activity", "/clubs"]) {
    await page.goto(route);
    const card = page.getByRole("article").first();
    await expect(card.getByRole("link")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const filter = page.getByRole("group", {
      name: /Filter (kategori kegiatan|jenis klub)/,
    });
    const selected = filter.getByRole("link", { name: "Semua", exact: true });
    await expect(selected).toHaveAttribute("aria-current", "page");
    const pagination = page.getByRole("navigation", {
      name: /Navigasi halaman daftar/,
    });
    await expect(
      pagination.getByRole("button", { name: "Sebelumnya" }),
    ).toBeDisabled();
    await expect(
      pagination.getByRole("link", { name: "Halaman berikutnya" }),
    ).toHaveAttribute("href", `${route}?page=2`);

    comparisons.push({
      search: await controlStyle(
        page.getByRole("search").getByRole("button", { name: "Cari" }),
      ),
      filter: await controlStyle(selected),
      pagination: await controlStyle(
        pagination.getByRole("link", { name: "Halaman berikutnya" }),
      ),
      action: await controlStyle(card.getByRole("link")),
      card: await card.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const media = element.querySelector(":scope > div")!;
        const mediaRect = media.getBoundingClientRect();
        return {
          width: rect.width,
          radius: style.borderRadius,
          padding: style.padding,
          mediaHeight: mediaRect.height,
          mediaTop: mediaRect.top - rect.top,
          mediaBackground: getComputedStyle(media).backgroundColor,
          sections: Array.from(element.querySelectorAll(":scope > div")).map(
            (section) => {
              const css = getComputedStyle(section);
              return {
                padding: css.padding,
                borderTop: css.borderTop,
                font: css.font,
              };
            },
          ),
        };
      }),
    });
    await page.screenshot({
      path: testInfo.outputPath(`${route.slice(1)}-full.png`),
      fullPage: true,
    });
  }
  expect(comparisons[0]).toEqual(comparisons[1]);
});

test("activity and club detail pages align their header and actions", async ({
  page,
}, testInfo) => {
  const comparisons = [];
  for (const route of ["/activity/kegiatan-uji-1", "/clubs/1"]) {
    await page.goto(route);
    const main = page.getByRole("main");
    const back = main.getByRole("link", { name: /^Kembali ke daftar/ });
    const heading = main.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(
      main.getByRole("complementary").getByRole("link"),
    ).toBeVisible();
    comparisons.push({
      back: await controlStyle(back),
      header: await heading.evaluate((element) => {
        const card = element.closest(".mantine-Card-root")!;
        const style = getComputedStyle(card);
        const headingStyle = getComputedStyle(element);
        return {
          top: card.getBoundingClientRect().top,
          width: card.getBoundingClientRect().width,
          padding: style.padding,
          radius: style.borderRadius,
          headingFont: headingStyle.font,
          gap: getComputedStyle(card.parentElement!).gap,
        };
      }),
      action: await controlStyle(
        main.getByRole("complementary").getByRole("link"),
      ),
      description: await main
        .getByRole("region", { name: /^(Deskripsi Kegiatan|Tentang Klub)$/ })
        .locator("p")
        .first()
        .evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            font: style.font,
            color: style.color,
            topMargin: style.marginTop,
            lastParagraphBottomMargin: getComputedStyle(
              element.parentElement!.lastElementChild!,
            ).marginBottom,
            lineHeight: style.lineHeight,
          };
        }),
    });
    await page.screenshot({
      path: testInfo.outputPath(
        `${route.startsWith("/clubs") ? "club" : "activity"}-detail-full.png`,
      ),
      fullPage: true,
    });
  }
  expect(comparisons[0]).toEqual(comparisons[1]);
});
