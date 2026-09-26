import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("history loads on activation and cancels a stale search without replacing newer results", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "session",
      value: `profile-history-${randomUUID()}`,
      url: "http://localhost:3000",
    },
  ]);
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/profile-history/"))
      requests.push(request.url());
  });
  await page.goto("/profile");
  await expect(
    page.getByLabel("Nama panggilan", { exact: true }),
  ).toBeVisible();
  expect(requests).toEqual([]);
  await page.getByRole("tab", { name: "Kegiatan", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(6);
  expect(requests.every((url) => url.includes("/activities?"))).toBe(true);
  let release!: () => void;
  let reached!: () => void;
  const ready = new Promise<void>((resolve) => {
    reached = resolve;
  });
  const blocked = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/profile-history/activities?**", async (route) => {
    if (new URL(route.request().url()).searchParams.get("search") === "stale") {
      reached();
      await blocked;
      await route
        .fulfill({
          json: {
            data: {
              items: [],
              meta: { total: 0, current_page: 1, per_page: 6, last_page: 1 },
              summary: { total: 8, accepted: 2, rejected: 2, pending: 4 },
            },
          },
        })
        .catch(() => {});
    } else await route.continue();
  });
  const search = page.getByLabel("Cari kegiatan", { exact: true });
  await search.fill("stale");
  await ready;
  await search.fill("Kepemimpinan");
  await expect(
    page.getByRole("status").filter({ hasText: "Memuat riwayat" }),
  ).toHaveCount(0);
  release();
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("tab", { name: "Data Diri", exact: true }).click();
  await page.goBack();
  await expect(search).toHaveValue("Kepemimpinan");
});

test("an achievement outside the former first-100 window opens directly by ID", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "session",
      value: `profile-history-${randomUUID()}`,
      url: "http://localhost:3000",
    },
  ]);
  await page.goto("/leaderboard/edit/1001");
  await expect(page.locator('input[value="Older achievement"]')).toBeVisible();
});
