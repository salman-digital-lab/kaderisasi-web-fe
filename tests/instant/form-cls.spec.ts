import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";

for (const scenario of [
  "guest",
  "member",
  "draft",
  "expired",
  "streaming",
] as const) {
  test(`form layout stays stable during delayed hydration (${scenario})`, async ({
    page,
    context,
    baseURL,
  }, testInfo) => {
    const member = scenario === "member";
    const path = member
      ? "/custom-form/club/1"
      : `/custom-form/activity/${scenario === "streaming" ? 991 : 1}?slug=kegiatan-uji-1`;
    if (member)
      await context.addCookies([
        { name: "session", value: "ui-preview", url: baseURL! },
      ]);
    await page.addInitScript(() => {
      const shifts: { value: number; start: number; nodes: string[] }[] = [];
      Object.assign(window, { formShifts: shifts });
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
                (source) => source.node?.tagName ?? "removed",
              ),
            });
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    if (scenario === "draft" || scenario === "expired") {
      await page.goto(path);
      await page
        .getByRole("textbox", { name: /Nama Lengkap/ })
        .fill("Peserta Uji");
      await page
        .getByRole("textbox", { name: /Email/ })
        .fill("peserta@example.test");
      await page
        .getByRole("button", { name: "Lanjutkan", exact: true })
        .click();
      await page
        .getByLabel("Motivasi mengikuti kegiatan")
        .fill("Draf pengujian CLS");
      await expect
        .poll(() =>
          page.evaluate(() => localStorage.getItem("customForm:v2:guest:1")),
        )
        .toContain("Draf pengujian CLS");
      if (scenario === "expired")
        await page.evaluate(() => {
          const key = "customForm:v2:guest:1";
          const draft = JSON.parse(localStorage.getItem(key)!);
          localStorage.setItem(key, JSON.stringify({ ...draft, expiresAt: 1 }));
        });
    }
    await page.route("**/_next/static/**/*.js", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.continue();
    });
    await page.goto(path);
    await expect(
      page.getByRole("button", {
        name: scenario === "draft" ? "Kirim" : "Lanjutkan",
        exact: true,
      }),
    ).toBeEnabled();
    if (scenario === "draft")
      await expect(page.getByLabel("Motivasi mengikuti kegiatan")).toHaveValue(
        "Draf pengujian CLS",
      );
    if (scenario === "expired")
      await expect(
        page.getByRole("alert", { name: "Draf formulir" }),
      ).toContainText("masa penyimpanan");
    await page.waitForTimeout(1000);
    const shifts = await page.evaluate(
      () =>
        (
          window as typeof window & {
            formShifts: { value: number; start: number; nodes: string[] }[];
          }
        ).formShifts,
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
    const report = JSON.stringify({ cls: maximum, shifts }, null, 2);
    await writeFile(testInfo.outputPath("layout-shifts.json"), report);
    await page.screenshot({
      path: testInfo.outputPath("form.png"),
      fullPage: true,
    });
    await testInfo.attach("layout-shifts", {
      body: report,
      contentType: "application/json",
    });
    expect(maximum).toBeLessThanOrEqual(0.1);
  });
}
