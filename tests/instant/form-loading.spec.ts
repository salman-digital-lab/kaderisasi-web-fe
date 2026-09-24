import { expect, test } from "@playwright/test";

const guestPath = "/custom-form/activity/1?slug=kegiatan-uji-1";
const description = "Lengkapi data berikut untuk melanjutkan pendaftaran.";

test("form introduction is visible before application JavaScript loads", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto(guestPath, { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: "Formulir Pendaftaran Kegiatan" }),
  ).toBeVisible();
  await expect(page.getByText(description, { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Memuat formulir...");
  await expect(
    page.getByRole("button", { name: "Lanjutkan", exact: true }),
  ).toHaveCount(0);
});

test("guest answers and current step survive reload, and reset returns to the introduction", async ({
  page,
}) => {
  await page.goto(guestPath);
  await page.getByRole("textbox", { name: /Nama Lengkap/ }).fill("Peserta Uji");
  await page
    .getByRole("textbox", { name: /Email/ })
    .fill("peserta@example.test");
  await page.getByRole("button", { name: "Lanjutkan", exact: true }).click();
  const answer = page.getByLabel("Motivasi mengikuti kegiatan");
  await answer.fill("Draf motivasi peserta");
  await expect
    .poll(async () =>
      page.evaluate(() => localStorage.getItem("customForm:v2:guest:1")),
    )
    .toContain("Draf motivasi peserta");
  await page.reload();
  await expect(answer).toHaveValue("Draf motivasi peserta");
  await page.getByRole("button", { name: "Kembali", exact: true }).click();
  await expect(page.getByRole("textbox", { name: /Nama Lengkap/ })).toHaveValue(
    "Peserta Uji",
  );
  await page.goto(`${guestPath}&reset=1`);
  await expect(page.getByRole("textbox", { name: /Nama Lengkap/ })).toHaveValue(
    "",
  );
  await expect(page.getByText(description, { exact: true })).toBeVisible();
});

test("club forms retain guest and already-registered redirects", async ({
  page,
  context,
  baseURL,
}) => {
  await page.goto("/custom-form/club/1");
  await expect(page).toHaveURL(/\/login\?redirect=%2Fclubs%2F1$/);
  await context.addCookies([
    { name: "session", value: "ui-preview", url: baseURL! },
  ]);
  await page.goto("/custom-form/club/2");
  await expect(page).toHaveURL(/\/custom-form\/club\/2\/success$/);
  await page.goto("/custom-form/club/1");
  await expect(page.getByText(description, { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lanjutkan", exact: true }),
  ).toBeVisible();
});

test("success page renders compact instructions for guest activities and member clubs", async ({
  page,
  context,
  baseURL,
}) => {
  await page.goto("/custom-form/activity/1/success");
  await expect(
    page.getByRole("heading", { name: "Pendaftaran Berhasil!" }),
  ).toBeVisible();
  await expect(
    page.getByText("Pantau status pendaftaran melalui halaman Kegiatan Saya."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Lihat Daftar Kegiatan" }),
  ).toHaveAttribute("href", "/activity");
  await context.addCookies([
    { name: "session", value: "ui-preview", url: baseURL! },
  ]);
  await page.goto("/custom-form/club/2/success");
  await expect(
    page.getByRole("heading", { name: "Pendaftaran Berhasil!" }),
  ).toBeVisible();
  await expect(
    page.getByText("Pantau status pendaftaran melalui halaman Kegiatan Saya."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Kembali ke Detail Klub" }),
  ).toHaveAttribute("href", "/clubs/2");
});
