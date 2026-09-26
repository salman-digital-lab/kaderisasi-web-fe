import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

type Shift = { value: number; start: number; nodes: string[] };
const routes = [
  {
    name: "missing activity",
    path: "/activity/cls-missing",
    heading: "Halaman tidak ditemukan",
  },
  {
    name: "activity",
    path: "/activity/kegiatan-uji-1",
    heading: "Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman",
  },
  {
    name: "failed poster",
    path: "/activity/cls-poster",
    heading: "Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman",
  },
  { name: "club", path: "/clubs/1", heading: "Klub Kolaborasi Salman" },
  {
    name: "club success",
    path: "/custom-form/club/2/success",
    heading: "Pendaftaran Berhasil!",
  },
  {
    name: "activity success",
    path: "/custom-form/activity/1/success",
    heading: "Pendaftaran Berhasil!",
  },
  { name: "status", path: "/status", heading: "Cek Status Kegiatan" },
  {
    name: "member form",
    path: "/custom-form/activity/1",
    heading: "Formulir Pendaftaran Kegiatan",
  },
  { name: "course", path: "/kelas/2", heading: /./ },
];

for (const route of routes) {
  test(`layout stability: ${route.name}`, async ({
    page,
    context,
    baseURL,
  }, testInfo) => {
    await context.addCookies([
      {
        name: "session",
        value: route.name === "status" ? "profile-status-cls" : "ui-preview",
        url: baseURL!,
      },
    ]);
    await page.addInitScript(() => {
      const shifts: Shift[] = [];
      Object.assign(window, { routeShifts: shifts });
      new PerformanceObserver((list) => {
        for (const item of list.getEntries()) {
          const entry = item as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
            sources: { node?: Element }[];
          };
          if (!entry.hadRecentInput)
            shifts.push({
              value: entry.value,
              start: entry.startTime,
              nodes: entry.sources.map(
                (source) => source.node?.outerHTML.slice(0, 180) ?? "removed",
              ),
            });
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.route("**/_next/static/**/*.js", async (request) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await request.continue();
    });
    if (route.name === "failed poster") {
      await page.route("**/_next/image**", async (request) => {
        if (!request.request().url().includes("cls-poster"))
          return request.continue();
        await new Promise((resolve) => setTimeout(resolve, 2200));
        await request.abort();
      });
    }
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );
    await page.waitForTimeout(3500);
    const shifts = await page.evaluate(
      () => (window as typeof window & { routeShifts: Shift[] }).routeShifts,
    );
    let maximum = 0,
      score = 0,
      start = 0,
      previous = 0;
    for (const shift of shifts) {
      if (shift.start - previous > 1000 || shift.start - start > 5000) {
        score = 0;
        start = shift.start;
      }
      score += shift.value;
      maximum = Math.max(maximum, score);
      previous = shift.start;
    }
    await writeFile(
      testInfo.outputPath("layout-shifts.json"),
      JSON.stringify({ cls: maximum, shifts }, null, 2),
    );
    await testInfo.attach("layout-shifts", {
      body: JSON.stringify({ cls: maximum, shifts }, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: testInfo.outputPath("page.png"),
      fullPage: true,
    });
    expect(maximum).toBeLessThanOrEqual(0.1);
  });
}

test("poster failures retain the image frame dimensions", async ({ page }) => {
  let failImage!: () => void;
  const failure = new Promise<void>((resolve) => {
    failImage = resolve;
  });
  await page.route("**/_next/image**", async (request) => {
    if (!request.request().url().includes("cls-poster"))
      return request.continue();
    await failure;
    await request.abort();
  });
  await page.goto("/activity/cls-poster", { waitUntil: "domcontentloaded" });
  const frame = page.locator("#active-activity-poster");
  await expect(frame).toBeVisible();
  const before = await frame.boundingBox();
  failImage();
  await expect(
    page.getByText("Poster belum dapat dimuat.", { exact: true }),
  ).toBeVisible();
  const after = await frame.boundingBox();
  expect(after?.height).toBe(before?.height);
  expect(after?.width).toBe(before?.width);
});
