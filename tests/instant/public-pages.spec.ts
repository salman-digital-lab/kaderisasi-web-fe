import { expect, test } from "@playwright/test";

// Verification reviewers and visitors must see the public content even when
// scripts cannot run or a previous session has expired.
test.use({ javaScriptEnabled: false });

for (const session of ["guest", "expired"] as const) {
  test.describe(`public information for ${session} visitors`, () => {
    test.beforeEach(async ({ context, baseURL }) => {
      if (session === "expired") {
        await context.addCookies([
          { name: "session", value: "expired-session", url: baseURL! },
        ]);
      }
    });

    test("homepage explains the app and links to its privacy policy", async ({
      page,
    }, testInfo) => {
      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
      expect(response?.request().redirectedFrom()).toBeNull();
      await expect(
        page.getByRole("heading", {
          name: "Selamat Datang di Kaderisasi Salman",
        }),
      ).toBeVisible();
      await expect(
        page.getByText(/Nama, email, dan data yang Anda isi/),
      ).toBeVisible();

      await page
        .getByRole("main")
        .getByRole("link", { name: "Kebijakan Privasi", exact: true })
        .first()
        .click();
      await expect(page).toHaveURL(/\/privacy-policy$/);
      await expect(
        page.getByRole("heading", { name: "Kebijakan Privasi", exact: true }),
      ).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath("privacy-policy.png") });
    });

    test("privacy disclosures are readable without signing in", async ({
      page,
    }) => {
      const response = await page.goto("/privacy-policy");
      expect(response?.status()).toBe(200);
      expect(response?.request().redirectedFrom()).toBeNull();

      for (const section of [
        "google",
        "tujuan",
        "berbagi",
        "penyimpanan",
        "retensi",
        "hak",
        "kontak",
      ]) {
        await expect(page.locator(`section#${section}`)).toBeVisible();
      }
      await expect(
        page.getByRole("link", { name: "digilab@salmanitb.com", exact: true }),
      ).toHaveAttribute("href", "mailto:digilab@salmanitb.com");
      await expect(
        page.getByRole("link", { name: "Kelola koneksi Akun Google" }),
      ).toHaveAttribute("href", "https://myaccount.google.com/connections");
    });

    test("terms remain publicly accessible", async ({ page }) => {
      const response = await page.goto("/terms-of-service");
      expect(response?.status()).toBe(200);
      expect(response?.request().redirectedFrom()).toBeNull();
      await expect(
        page.getByRole("heading", {
          name: "Syarat dan Ketentuan",
          exact: true,
        }),
      ).toBeVisible();
    });
  });
}

test("private profile still requires login", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login$/);
});
