import { expect, test } from "@playwright/test";

test("an unpublished activity still shows the member's registration", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    { name: "session", value: "ui-archive", url: baseURL! },
  ]);
  await page.goto("/profile/activity/kegiatan-arsip");

  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", {
      level: 1,
      name: "Kegiatan Arsip Angkatan Lalu",
    }),
  ).toBeVisible();
  await expect(main.getByText("LULUS KEGIATAN")).toBeVisible();
  await expect(
    main.getByText(/sudah tidak ditampilkan untuk umum/),
  ).toBeVisible();
  await expect(
    main.getByRole("link", { name: "Ubah jawaban formulir" }),
  ).toHaveCount(0);
  await expect(page).toHaveTitle(/^Pendaftaran - Kegiatan\b/);
});
