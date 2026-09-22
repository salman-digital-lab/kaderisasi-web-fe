import { expect, test } from "@playwright/test";

for (const scheme of ["light", "dark", "auto"] as const) {
  test(`browser chrome follows ${scheme} preference and page surface`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    if (scheme !== "light") {
      await page.addInitScript((value) => {
        localStorage.setItem("mantine-color-scheme-value", value);
      }, scheme);
    }
    const resolved = scheme === "light" ? "light" : "dark";
    for (const [route, color] of [
      ["/clubs", resolved === "light" ? "#fff" : "#242424"],
      ["/login", resolved === "light" ? "#f8f9fa" : "#242424"],
    ] as const) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute(
        "data-mantine-color-scheme",
        resolved,
      );
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
        "content",
        color,
      );
      await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
        "content",
        resolved,
      );
      const viewport = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");
      expect(viewport).toContain("viewport-fit=cover");
      expect(viewport).toContain("interactive-widget=resizes-content");
      expect(viewport).not.toMatch(/maximum-scale|user-scalable=no/);
    }
    // Soft navigation must restore the header surface without reloading the document.
    await page.getByRole("link", { name: "Kembali ke Beranda" }).click();
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      resolved === "light" ? "#fff" : "#242424",
    );
    if (scheme === "auto") {
      await page.emulateMedia({ colorScheme: "light" });
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
        "content",
        "#fff",
      );
    }
  });
}

test.describe("touch interaction", () => {
  test.use({ hasTouch: true });
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile",
      "Touch-specific checks use the mobile project",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("Mantine primary button keeps its own press treatment", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByRole("button", { name: "Masuk", exact: true });
    await button.hover();
    await page.mouse.down();
    await expect(button).toHaveCSS("opacity", "1");
    await page.mouse.move(0, 0);
    await page.mouse.up();
  });

  test("inputs stay readable and retain useful keyboards", async ({ page }) => {
    for (const route of [
      "/login",
      "/register",
      "/custom-form/activity/1?slug=kegiatan-uji-1",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const inputs = page.locator(
        'input:not([type="hidden"]):visible, textarea:visible, select:visible',
      );
      await expect(inputs.first()).toBeVisible();
      for (const input of await inputs.all()) {
        const fontSize = await input.evaluate((element) =>
          parseFloat(getComputedStyle(element).fontSize),
        );
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
      for (const input of await page
        .locator('input[type="email"]:visible')
        .all()) {
        await expect(input).toHaveAttribute("autocapitalize", "none");
        await expect(input).toHaveAttribute("autocorrect", "off");
      }
      for (const input of await page
        .locator('input[type="tel"]:visible')
        .all()) {
        await expect(input).toHaveAttribute("inputmode", "tel");
      }
    }
  });

  test("short landscape drawer scrolls independently and returns focus", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 740, height: 360 });
    await page.goto("/clubs");
    const trigger = page.getByRole("button", {
      name: "Buka menu",
      exact: true,
    });
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "Menu navigasi" });
    const navigation = dialog.getByRole("navigation", {
      name: "Navigasi menu",
    });
    await expect(navigation).toBeVisible();
    expect(
      await navigation.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    await expect(navigation).toHaveCSS("overscroll-behavior-y", "contain");
    await expect(page.locator("html")).toHaveCSS(
      "overscroll-behavior-y",
      "auto",
    );
    const close = dialog.getByRole("button", { name: "Tutup menu" });
    const account = dialog.getByRole("link", { name: "Daftar", exact: true });
    const before = await account.boundingBox();
    await navigation.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(await account.boundingBox()).toEqual(before);
    await expect(close).toBeInViewport();
    await expect(account).toBeInViewport();
    await page.screenshot({
      path: testInfo.outputPath("drawer-landscape.png"),
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("custom links release hover and show immediate press feedback", async ({
    page,
  }) => {
    await page.goto("/clubs/1");
    const link = page
      .getByRole("link", { name: "Kembali", exact: false })
      .first();
    await expect(link).toBeVisible();
    await link.hover();
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await expect(link).toHaveCSS("touch-action", "manipulation");
    const idleBackground = await link.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.mouse.down();
    await expect(link).not.toHaveCSS("background-color", idleBackground);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await expect(link).toHaveCSS("background-color", idleBackground);
    await page.goto("/privacy-policy");
    await expect(page.locator("main p").first()).not.toHaveCSS(
      "user-select",
      "none",
    );
    await expect(page.locator("main a[href]").first()).not.toHaveCSS(
      "user-select",
      "none",
    );
  });
});

test("mouse hover and keyboard focus remain visible", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/clubs/1");
  const link = page.getByRole("link", { name: /^Kembali ke daftar/ });
  await link.hover();
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
});

test("disabled save buttons do not acquire press feedback", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    { name: "session", value: "ui-preview", url: baseURL! },
  ]);
  await page.goto("/profile");
  const button = page.getByRole("button", {
    name: "Simpan perubahan",
    exact: true,
  });
  await expect(button).toBeDisabled();
  await button.scrollIntoViewIfNeeded();
  const opacity = await button.evaluate(
    (element) => getComputedStyle(element).opacity,
  );
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS("opacity", opacity);
  await page.mouse.up();
});

test("notification dialogs contain scrolling and the bell restores focus", async ({
  page,
  context,
  baseURL,
}, testInfo) => {
  await context.addCookies([
    { name: "session", value: "ui-preview", url: baseURL! },
  ]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const item = {
    id: 1,
    title: "Pengumuman uji",
    body: "Isi pengumuman yang dapat dipilih dan disalin.\n".repeat(50),
    link_label: null,
    link_url: null,
    published_at: "2026-09-01T00:00:00Z",
    read_at: null,
  };
  await page.route("**/api/notifications**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    const data = path.endsWith("/unread-count")
      ? { unread: 1 }
      : path.endsWith("/read")
        ? item
        : { items: [item], next_cursor: "", cutoff: "2026-09-23T00:00:00Z" };
    await route.fulfill({ json: { data } });
  });
  await page.goto("/notifications");
  const bell = page.getByRole("button", { name: "Notifikasi, 1 belum dibaca" });
  await bell.click();
  await expect(bell).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Lihat semua notifikasi" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bell).toBeFocused();
  await expect(bell).toHaveAttribute("aria-expanded", "false");
  await page.goto("/notifications?id=1");
  const dialog = page.getByRole("dialog", { name: item.title });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("overscroll-behavior-y", "contain");
  const bounds = await dialog.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height,
  );
  await dialog.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath("notification-dialog.png"),
  });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
