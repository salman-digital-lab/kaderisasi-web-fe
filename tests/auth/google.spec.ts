import { test, expect, type Page } from "@playwright/test";

async function googleResponse(page: Page, cancelled = false): Promise<void> {
  await page.route(
    "https://accounts.google.com/o/oauth2/v2/auth**",
    async (route) => {
      const url = new URL(route.request().url());
      expect(url.searchParams.get("scope")).toBe("openid email profile");
      expect(url.searchParams.get("code_challenge_method")).toBe("S256");
      expect(url.searchParams.get("code_challenge")).toHaveLength(43);
      expect(url.searchParams.get("nonce")).toHaveLength(43);
      const callback = new URL(url.searchParams.get("redirect_uri")!);
      callback.searchParams.set("state", url.searchParams.get("state")!);
      callback.searchParams.set(
        cancelled ? "error" : "code",
        cancelled ? "access_denied" : "browser-test-code",
      );
      await route.fulfill({
        status: 302,
        headers: { location: callback.toString() },
      });
    },
  );
}

for (const destination of [
  "/",
  "/custom-form/activity/1",
  "/clubs/1",
  "/consultation",
]) {
  test(`Google returns users to ${destination}`, async ({ page, context }) => {
    await googleResponse(page);
    await page.goto(`/login?redirect=${encodeURIComponent(destination)}`);
    await page.getByRole("button", { name: "Lanjutkan dengan Google" }).click();
    await expect(page).toHaveURL(`http://localhost:3000${destination}`);
    const session = (await context.cookies()).find(
      (cookie) => cookie.name === "session",
    );
    expect(session?.value).toBe("ui-preview");
    expect(session?.httpOnly).toBe(true);
    expect(session?.sameSite).toBe("Lax");
  });
}

test("registration uses Google without asking for a password", async ({
  page,
}) => {
  await googleResponse(page);
  await page.goto("/register?redirect=%2Fclubs%2F1");
  await page.getByRole("button", { name: "Lanjutkan dengan Google" }).click();
  await expect(page).toHaveURL("http://localhost:3000/clubs/1");
});

test("cancel, switch to email login, and retry retain the destination", async ({
  page,
}) => {
  await googleResponse(page, true);
  await page.goto("/register?redirect=%2Fconsultation");
  await page.getByRole("button", { name: "Lanjutkan dengan Google" }).click();
  await expect(
    page.getByRole("alert", { name: "Belum berhasil masuk" }),
  ).toContainText("dibatalkan");
  await page.getByRole("link", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?redirect=%2Fconsultation/);
  await page.getByRole("textbox", { name: /^Email/ }).fill("fixture@gmail.com");
  await page
    .locator('input[autocomplete="current-password"]')
    .fill("fixture-password");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/consultation");
});

test("activity and club entry points preserve registration context", async ({
  page,
}) => {
  await page.goto("/activity/kegiatan-uji-1/join");
  await page.getByRole("link", { name: /^Buat akun Daftar akun baru/ }).click();
  await expect(page).toHaveURL(
    /\/register\?redirect=%2Fcustom-form%2Factivity%2F1/,
  );
  await expect(
    page.getByRole("button", { name: "Lanjutkan dengan Google" }),
  ).toBeVisible();
  await page.goto("/clubs/1");
  const links = page.locator('a[href="/login?redirect=%2Fclubs%2F1"]');
  expect(await links.count()).toBeGreaterThan(0);
});

test("navbar sign-in returns to the detail page", async ({
  page,
}, testInfo) => {
  await page.goto("/activity/kegiatan-uji-1");
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Buka menu" }).click();
  await page
    .getByRole("link", { name: "Masuk", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(
    /\/login\?redirect=%2Factivity%2Fkegiatan-uji-1/,
  );
});

test("auth pages keep layout and keyboard access", async ({
  page,
}, testInfo) => {
  for (const route of ["login", "register", "forgot"]) {
    await page.goto(`/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (route !== "forgot") {
      const google = page.getByRole("button", {
        name: "Lanjutkan dengan Google",
      });
      await google.focus();
      await expect(google).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("textbox", {
          name: route === "login" ? /^Email/ : /^Nama Lengkap/,
        }),
      ).toBeFocused();
    }
    await page.screenshot({
      path: testInfo.outputPath(`${route}.png`),
      fullPage: true,
    });
  }
});
