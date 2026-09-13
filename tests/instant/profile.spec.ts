import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import type { Page, BrowserContext } from "@playwright/test";
import type { AxeResults } from "axe-core";
const require = createRequire(`${process.cwd()}/package.json`);
const screenshotDir = path.resolve("../profile-ux-review/after");
const tabs = {
  profiledata: "Data Diri",
  activity: "Kegiatan",
  ruangcurhat: "Ruang Curhat",
  achievements: "Prestasi",
};
async function signIn(context: BrowserContext, mode = "review"): Promise<void> {
  await context.addCookies([
    {
      name: "session",
      value: `profile-${mode}-${randomUUID()}`,
      url: "http://localhost:3000",
    },
  ]);
}
async function tab(page: Page, name: string): Promise<void> {
  await page.getByRole("tab", { name, exact: true }).click();
  await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
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
    return result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    }));
  });
  expect(violations).toEqual([]);
}
for (const [value, label] of Object.entries(tabs)) {
  test(`profile ${label}: deep link, layout and accessibility`, async ({
    page,
    context,
  }, testInfo) => {
    await signIn(context);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/profile?tab=${value}`);
    await expect(
      page.getByRole("tab", { name: label, exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("heading", { name: "Peserta Uji Profil" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Ubah foto", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await axe(page);
    expect(errors).toEqual([]);
    await mkdir(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${testInfo.project.name}-${value}.png`),
      fullPage: true,
    });
  });
}
test("profile tabs retain drafts, searches, pagination and browser history", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=invalid&source=test");
  await expect(page.getByRole("tab", { name: "Data Diri" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByLabel("Nama panggilan", { exact: true }).fill("Draf peserta");
  await tab(page, "Kegiatan");
  await page.getByRole("button", { name: "Halaman 2", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await tab(page, "Prestasi");
  await page.getByLabel("Cari prestasi", { exact: true }).fill("Lomba");
  await page.goBack();
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.goBack();
  await expect(page.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
    "Draf peserta",
  );
  await page.goForward();
  expect(new URL(page.url()).searchParams.get("source")).toBe("test");
  await tab(page, "Prestasi");
  await expect(page.getByLabel("Cari prestasi", { exact: true })).toHaveValue(
    "Lomba",
  );
});
test("activity search and exact status filters reset pagination and preserve actions", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=activity");
  await page.getByRole("button", { name: "Halaman 2", exact: true }).click();
  await page.getByRole("combobox", { name: "Status pendaftaran" }).click();
  await page.getByRole("option", { name: "Terdaftar", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Edit formulir/ })).toHaveCount(
    3,
  );
  await page.getByLabel("Cari kegiatan", { exact: true }).fill("tidak-ada");
  await expect(page.getByText("Tidak ada kegiatan yang sesuai")).toBeVisible();
  await page.getByRole("button", { name: "Hapus pencarian" }).click();
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(page.getByRole("link", { name: /sertifikat/i })).toHaveCount(1);
  await page.getByRole("combobox", { name: "Status pendaftaran" }).click();
  await page
    .getByRole("option", { name: "Belum diumumkan", exact: true })
    .click();
  await expect(page.getByText(/Diumumkan:/)).toBeVisible();
});
test("consultation filters preserve every status and descriptions expand", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=ruangcurhat");
  await expect(page.getByRole("article")).toHaveCount(5);
  const expand = page
    .getByRole("button", { name: "Baca selengkapnya" })
    .first();
  await expand.click();
  await expect(
    page.getByRole("button", { name: "Ringkas deskripsi" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Ringkas deskripsi" }).click();
  await expect(
    page.getByRole("button", { name: "Baca selengkapnya" }).first(),
  ).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("combobox", { name: "Status sesi" }).click();
  await page
    .getByRole("option", { name: "Belum Ditangani", exact: true })
    .click();
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByLabel("Cari sesi Ruang Curhat").fill("tidak-ada");
  await expect(page.getByText("Tidak ada sesi yang sesuai")).toBeVisible();
  await page.getByRole("button", { name: "Hapus pencarian" }).click();
  await expect(page.getByRole("article")).toHaveCount(5);
  await expect(
    page.getByRole("link", { name: "Ajukan sesi baru" }),
  ).toHaveAttribute("href", "/consultation");
});
test("achievement details preserve scoring and status-specific actions", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=achievements");
  await expect(page.getByText("3 prestasi · 60 total poin")).toBeVisible();
  await page.getByRole("button", { name: /Lomba karya mahasiswa/ }).click();
  await expect(
    page.getByRole("link", { name: "Edit prestasi", exact: true }),
  ).toHaveAttribute("href", "/leaderboard/edit/1");
  await page.getByRole("button", { name: /Kontribusi komunitas/ }).click();
  await expect(
    page.getByRole("link", { name: "Edit prestasi", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Riset terapan/ }).click();
  await expect(page.getByText("Lengkapi dokumen pendukung.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Unduh bukti" })).toBeVisible();
  await page.getByRole("combobox", { name: "Status prestasi" }).click();
  await page.getByRole("option", { name: "Disetujui", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Kontribusi komunitas/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Riset terapan/ })).toHaveCount(
    0,
  );
  await page.getByLabel("Cari prestasi", { exact: true }).fill("tidak-ada");
  await expect(page.getByText("Tidak ada prestasi yang sesuai")).toBeVisible();
  await page.getByRole("button", { name: "Hapus pencarian" }).click();
  await expect(
    page.getByRole("button", { name: /Riset terapan/ }),
  ).toBeVisible();
});
test("profile save, failed save, discard and dates keep the correct baseline", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await expect(
    page.getByRole("button", { name: "Simpan perubahan", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Tanggal lahir")).toHaveValue("15/05/2000");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Nama tersimpan");
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nama tersimpan", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Gagal simpan");
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Simpan gagal pada fixture.",
  );
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue(
    "Gagal simpan",
  );
  await page.getByRole("button", { name: "Batalkan perubahan" }).click();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue(
    "Nama tersimpan",
  );
  await page.reload();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue(
    "Nama tersimpan",
  );
  await expect(page.getByLabel("Tanggal lahir")).toHaveValue("15/05/2000");
});
test("history editors validate locally, cancel, delete and persist explicitly", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await page
    .getByRole("button", { name: "Tambah pekerjaan / aktivitas", exact: true })
    .click();
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await expect(page.getByText("Posisi/jabatan wajib diisi")).toBeVisible();
  await page.getByLabel("Posisi / jabatan", { exact: true }).fill("Mentor");
  await page
    .getByLabel("Perusahaan / organisasi", { exact: true })
    .fill("Komunitas");
  await page.getByLabel("Tahun mulai", { exact: true }).fill("2025");
  await page.getByLabel("Tahun selesai", { exact: true }).fill("2024");
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await expect(
    page.getByText("Tahun selesai tidak boleh lebih kecil dari tahun mulai"),
  ).toBeVisible();
  await page.getByLabel("Tahun selesai", { exact: true }).fill("2026");
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await page
    .getByRole("button", { name: "Tambah pendidikan", exact: true })
    .click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.getByText("Pendidikan 2", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Mentor · Komunitas · 2025 - 2026"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Hapus pekerjaan 2", exact: true })
    .click();
  await page.getByRole("button", { name: "Batalkan perubahan" }).click();
  await expect(
    page.getByText("Mentor · Komunitas · 2025 - 2026"),
  ).toBeVisible();
});
test("dependent cities show errors, retry and discard restores selections", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await expect(
    page.getByRole("combobox", { name: "Kota / kabupaten", exact: true }),
  ).toHaveValue("Kota Bandung");
  let failed = false;
  await page.route("**/v2/provinces/99/cities", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({
        status: 503,
        json: { message: "Fixture city failure" },
      });
    } else await route.continue();
  });
  await page.getByRole("combobox", { name: "Provinsi", exact: true }).click();
  await page
    .getByRole("option", { name: "Provinsi uji gangguan", exact: true })
    .click();
  await expect(page.getByText("Daftar kota belum dapat dimuat.")).toBeVisible();
  await page.getByRole("button", { name: "Muat ulang kota" }).click();
  await expect(
    page.getByRole("combobox", { name: "Kota / kabupaten", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("combobox", { name: "Kota / kabupaten", exact: true })
    .click();
  await page
    .getByRole("option", { name: "Kota uji lainnya", exact: true })
    .click();
  await page.getByRole("button", { name: "Batalkan perubahan" }).click();
  await expect(
    page.getByRole("combobox", { name: "Kota / kabupaten", exact: true }),
  ).toHaveValue("Kota Bandung");
});
for (const [section, label] of [
  ["activities", "Kegiatan"],
  ["consultations", "Ruang Curhat"],
  ["achievements", "Prestasi"],
] as const) {
  test(`isolated ${section} failure and retry retain a profile draft`, async ({
    page,
    context,
  }) => {
    await signIn(context, `error-${section}`);
    await page.goto("/profile");
    await page
      .getByLabel("Nama panggilan", { exact: true })
      .fill("Draf saat gangguan");
    await tab(page, label);
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "belum dapat dimuat",
    );
    await page.getByRole("button", { name: "Coba lagi" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
    await tab(page, "Data Diri");
    await expect(
      page.getByLabel("Nama panggilan", { exact: true }),
    ).toHaveValue("Draf saat gangguan");
  });
}
test("empty tabs and expired authentication have distinct states", async ({
  page,
  context,
}) => {
  await signIn(context, "empty");
  await page.goto("/profile?tab=activity");
  await expect(
    page.getByText("Belum ada kegiatan", { exact: true }),
  ).toBeVisible();
  await tab(page, "Ruang Curhat");
  await expect(
    page.getByText("Belum ada sesi Ruang Curhat", { exact: true }),
  ).toBeVisible();
  await tab(page, "Prestasi");
  await expect(
    page.getByText("Belum ada prestasi", { exact: true }),
  ).toBeVisible();
  await signIn(context, "expired");
  await page.goto("/profile");
  await expect(page).not.toHaveURL(/\/profile/);
});
test("photo validation, upload feedback and keyboard activation", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  const upload = page.locator("input[type=file]");
  await upload.setInputFiles({
    name: "test.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("test"),
  });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "JPG atau PNG",
  );
  await upload.setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "maksimal 2 MB",
  );
  const filechooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Ubah foto", exact: true }).focus();
  await page.keyboard.press("Enter");
  await (
    await filechooser
  ).setFiles({
    name: "test.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.getByText("Foto berhasil diperbarui.")).toBeVisible();
});
test("keyboard tabs, narrow reflow and dark mode remain usable", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await page.getByRole("tab", { name: "Data Diri", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Kegiatan", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Prestasi", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "Data Diri", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "Data Diri", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const focused = await page
    .getByRole("tab", { name: "Data Diri", exact: true })
    .evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
      };
    });
  expect(focused.style).not.toBe("none");
  expect(focused.width).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("tabpanel", { name: "Data Diri", exact: true }),
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.evaluate(() => {
    localStorage.setItem("mantine-color-scheme-value", "dark");
  });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-mantine-color-scheme",
    "dark",
  );
  for (const label of Object.values(tabs)) {
    await tab(page, label);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await axe(page);
  }
});

test("full-form validation opens invalid history and blocks an incomplete city", async ({
  page,
  context,
}) => {
  await signIn(context, "invalid-history");
  await page.goto("/profile");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("");
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByText("Nama lengkap wajib diisi.")).toBeVisible();
  await expect(
    page.getByLabel("Posisi / jabatan", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Nama lengkap", { exact: true })
    .fill("Peserta Uji Profil");
  await page.getByLabel("Posisi / jabatan", { exact: true }).fill("Mentor");
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await page.getByRole("combobox", { name: "Provinsi", exact: true }).click();
  await page.getByRole("option", { name: "DKI Jakarta", exact: true }).click();
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(
    page.getByText("Pilih kota / kabupaten untuk provinsi ini."),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Kota / kabupaten", exact: true })
    .click();
  await page.getByRole("option", { name: "Kota Jakarta", exact: true }).click();
  await page.getByLabel("Tanggal lahir").fill("29/02/2000");
  await page.getByLabel("Tanggal lahir").press("Tab");
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Tanggal lahir")).toHaveValue("29/02/2000");
  await expect(
    page.getByRole("combobox", { name: "Kota / kabupaten", exact: true }),
  ).toHaveValue("Kota Jakarta");
});

test("photo upload failure keeps the draft and permits retrying the same file", async ({
  page,
  context,
}) => {
  await signIn(context, "upload-error");
  await page.goto("/profile");
  await page.getByLabel("Nama panggilan", { exact: true }).fill("Draf foto");
  const file = {
    name: "test.png",
    mimeType: "image/png",
    buffer: Buffer.from("fixture image"),
  };
  await page.locator("input[type=file]").setInputFiles(file);
  await expect(page.getByText("Mengunggah foto...")).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Foto belum berhasil diperbarui",
  );
  await expect(page.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
    "Draf foto",
  );
  await page.locator("input[type=file]").setInputFiles(file);
  await expect(page.getByText("Foto berhasil diperbarui.")).toBeVisible();
});

test("proof downloads report HTTP failure and can be retried", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=achievements");
  let failed = false;
  await page.route("**/fixture-proof.pdf", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({
        status: 503,
        body: "unavailable",
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    } else
      await route.fulfill({
        contentType: "application/pdf",
        body: "%PDF-1.4\n%%EOF",
        headers: { "Access-Control-Allow-Origin": "*" },
      });
  });
  await page.getByRole("button", { name: /Lomba karya mahasiswa/ }).click();
  await page.getByRole("button", { name: "Unduh bukti" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Bukti belum dapat diunduh",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh bukti" }).click();
  expect((await download).suggestedFilename()).toBe(
    "bukti-prestasi-Lomba karya mahasiswa.pdf",
  );
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
});

test("identity failure preserves other tabs and retry restores the editor", async ({
  page,
  context,
}) => {
  await signIn(context, "error-identity");
  await page.goto("/profile");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "belum dapat dimuat",
  );
  await tab(page, "Kegiatan");
  await expect(page.getByRole("article")).toHaveCount(6);
  await tab(page, "Data Diri");
  await page.getByRole("button", { name: "Coba lagi" }).click();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue(
    "Peserta Uji Profil",
  );
});

test("profile action destinations open their existing pages", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile?tab=activity");
  await page
    .getByRole("link", { name: /Lihat detail/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman",
  );
  await page.goto("/profile?tab=activity");
  await page
    .getByRole("link", { name: /Edit formulir/ })
    .first()
    .click();
  await expect(page.getByLabel("Motivasi mengikuti kegiatan")).toBeVisible();
  await page.goto("/profile?tab=activity");
  await page.getByRole("link", { name: /sertifikat/i }).click();
  await expect(page).toHaveURL(/\/certificate\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/profile?tab=activity");
  await page.getByRole("link", { name: "Cari kegiatan", exact: true }).click();
  await expect(page).toHaveURL(/\/activity$/);
  await page.goto("/profile?tab=ruangcurhat");
  await page.getByRole("link", { name: "Ajukan sesi baru" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ruang Curhat Kaderisasi Salman",
  );
  await page.goto("/profile?tab=achievements");
  await page.getByRole("link", { name: "Tambah prestasi" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kirim Prestasi Anda",
  );
  await page.goto("/profile?tab=achievements");
  await page.getByRole("button", { name: /Lomba karya mahasiswa/ }).click();
  await page.getByRole("link", { name: "Edit prestasi", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Edit Prestasi",
  );
  await page.goto("/profile");
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(page).not.toHaveURL(/\/profile/);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "session"),
  ).toBeUndefined();
});

test("comparison screenshots, 200 percent text zoom and 44 pixel actions", async ({
  page,
  context,
  browser,
}, testInfo) => {
  await signIn(context);
  await page.goto("/profile");
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  for (const label of Object.values(tabs)) {
    await tab(page, label);
    const overflow = await page.evaluate(() =>
      Array.from(document.querySelectorAll("main *"))
        .filter((node) => {
          const target =
            node instanceof HTMLInputElement && node.dataset.type === "hidden"
              ? (node.closest(".mantine-Input-wrapper") ?? node)
              : node;
          const rect = target.getBoundingClientRect();
          return (
            rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1)
          );
        })
        .slice(0, 12)
        .map((node) => node.outerHTML.slice(0, 240)),
    );
    expect(overflow).toEqual([]);
    const small = await page
      .getByRole("main")
      .locator("button:visible, a.mantine-Button-root:visible, input:visible")
      .evaluateAll((nodes) =>
        nodes.flatMap((node) => {
          if (node instanceof HTMLInputElement && node.type === "file")
            return [];
          const target =
            node instanceof HTMLInputElement && node.dataset.type === "hidden"
              ? (node.closest(".mantine-Input-wrapper") ?? node)
              : node;
          const rect = target.getBoundingClientRect();
          return rect.width < 43.9 || rect.height < 43.9
            ? [
                {
                  text: node.outerHTML.slice(0, 300),
                  width: rect.width,
                  height: rect.height,
                },
              ]
            : [];
        }),
      );
    expect(small).toEqual([]);
  }
  await page.evaluate(() =>
    document.documentElement.style.removeProperty("font-size"),
  );
  const zoomContext = await browser.newContext({
    baseURL: "http://localhost:3000",
    viewport: { width: 640, height: 400 },
    deviceScaleFactor: 2,
  });
  await signIn(zoomContext);
  const zoomPage = await zoomContext.newPage();
  await zoomPage.goto("/profile");
  for (const [value, label] of Object.entries(tabs)) {
    await tab(zoomPage, label);
    expect(
      await zoomPage.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (testInfo.project.name === "desktop")
      await zoomPage.screenshot({
        path: path.join(screenshotDir, `zoom-200-${value}.png`),
        fullPage: true,
      });
  }
  await zoomContext.close();
  await context.addCookies([
    { name: "session", value: "ui-preview", url: "http://localhost:3000" },
  ]);
  const comparison = path.join(screenshotDir, "comparison");
  await mkdir(comparison, { recursive: true });
  for (const [value, label] of Object.entries(tabs)) {
    await page.goto(`/profile?tab=${value}`);
    await expect(
      page.getByRole("tab", { name: label, exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.screenshot({
      path: path.join(comparison, `${testInfo.project.name}-${value}.png`),
      fullPage: true,
    });
  }
  for (const route of ["activity", "leaderboard", "consultation"]) {
    await page.goto(`/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".mantine-Skeleton-root")).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(
        comparison,
        `${testInfo.project.name}-related-${route}.png`,
      ),
      fullPage: true,
    });
  }
});

test("a new profile-service failure during retry preserves the mounted draft", async ({
  page,
  context,
}) => {
  await signIn(context, "error-activities-refresh-identity");
  await page.goto("/profile");
  await page
    .getByLabel("Nama panggilan", { exact: true })
    .fill("Draf tetap tersedia");
  await tab(page, "Kegiatan");
  await page.getByRole("button", { name: "Coba lagi" }).click();
  await expect(page.getByRole("article")).toHaveCount(6);
  await tab(page, "Data Diri");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Data diri belum dapat dimuat",
  );
  await expect(page.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
    "Draf tetap tersedia",
  );
  await page.getByRole("button", { name: "Coba lagi" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
  await expect(page.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
    "Draf tetap tersedia",
  );
});

for (const degree of ["SMA/SMK", "D3 (Diploma)"]) {
  test(`education saves and reloads ${degree} with a typed institution`, async ({ page, context }, testInfo) => {
    await signIn(context);
    await page.goto("/profile");
    await page.getByRole("button", { name: "Edit pendidikan 1", exact: true }).click();
    await page.getByRole("combobox", { name: "Jenjang", exact: true }).click();
    await page.getByRole("option", { name: degree, exact: true }).click();
    if (degree === "SMA/SMK") {
      await expect(page.getByLabel("Fakultas", { exact: true })).toHaveCount(0);
      await page.getByRole("textbox", { name: "Nama Sekolah", exact: true }).fill("Sekolah Peserta");
    } else {
      await page.getByRole("combobox", { name: "Institusi", exact: true }).fill("Sekolah Peserta");
      await page.getByRole("option", { name: "Sekolah Peserta", exact: true }).click();
      await page.getByLabel("Fakultas", { exact: true }).fill("");
    }
    await page.getByRole("button", { name: "Selesai", exact: true }).click();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Edit pendidikan 1", exact: true }).click();
    await expect(page.getByRole("combobox", { name: "Jenjang", exact: true })).toHaveValue(degree);
    await expect(page.getByRole(degree === "SMA/SMK" ? "textbox" : "combobox", { name: degree === "SMA/SMK" ? "Nama Sekolah" : "Institusi", exact: true })).toHaveValue("Sekolah Peserta");
    if (degree === "SMA/SMK") {
      await expect(page.getByLabel("Fakultas", { exact: true })).toHaveCount(0);
      await page.getByRole("combobox", { name: "Jenjang", exact: true }).click();
      await page.getByRole("option", { name: "S1", exact: true }).click();
      await expect(page.getByLabel("Fakultas", { exact: true })).toBeVisible();
      await expect(page.getByRole("combobox", { name: "Institusi", exact: true })).toHaveValue("Sekolah Peserta");
      await page.getByRole("combobox", { name: "Jenjang", exact: true }).click();
      await page.getByRole("option", { name: "SMA/SMK", exact: true }).click();
      await expect(page.getByRole("textbox", { name: "Nama Sekolah", exact: true })).toHaveValue("Sekolah Peserta");
      await page.getByRole("textbox", { name: "Nama Sekolah", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath("school-fields.png") });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test("education and focus edits save only through the main save action", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await page
    .getByRole("button", { name: "Edit pendidikan 1", exact: true })
    .click();
  await page.getByRole("combobox", { name: "Jenjang", exact: true }).click();
  await page.getByRole("option", { name: "S2", exact: true }).click();
  await page.getByRole("combobox", { name: "Institusi", exact: true }).click();
  await page.getByRole("option", { name: "Institut Uji", exact: true }).click();
  await page.getByLabel("Jurusan", { exact: true }).fill("Studi masyarakat");
  await page.getByLabel("Tahun masuk", { exact: true }).fill("2025");
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Bidang fokus", exact: true })
    .focus();
  await page
    .getByRole("combobox", { name: "Bidang fokus", exact: true })
    .press("ArrowDown");
  await page.getByRole("option", { name: "Sosial", exact: true }).click();
  await page.keyboard.press("Escape");
  await tab(page, "Kegiatan");
  await tab(page, "Data Diri");
  await expect(
    page.getByText(/S2 · Institut Uji · Teknik · Studi masyarakat · 2025/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
  await page.reload();
  await expect(
    page.getByText(/S2 · Institut Uji · Teknik · Studi masyarakat · 2025/),
  ).toBeVisible();
  await expect(
    page
      .getByRole("tabpanel", { name: "Data Diri", exact: true })
      .getByText("Sosial", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Hapus pendidikan 1", exact: true })
    .click();
  await expect(page.getByText("Belum ada riwayat pendidikan.")).toBeVisible();
  await page.getByRole("button", { name: "Batalkan perubahan" }).click();
  await expect(
    page.getByText(/S2 · Institut Uji · Teknik · Studi masyarakat · 2025/),
  ).toBeVisible();
});

test("repeated submit while saving sends one request", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto("/profile");
  await page
    .getByLabel("Nama panggilan", { exact: true })
    .fill("Simpan sekali");
  const requests: string[] = [];
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/profile", async (route) => {
    if (route.request().method() === "POST") {
      requests.push(route.request().url());
      await pending;
    }
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Simpan perubahan", exact: true })
    .click();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toBeDisabled();
  await page
    .getByRole("tabpanel", { name: "Data Diri" })
    .locator("form")
    .evaluate((form) => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toBeDisabled();
  release();
  await expect(page.getByText("Perubahan berhasil disimpan.")).toBeVisible();
  expect(requests).toHaveLength(1);
});
