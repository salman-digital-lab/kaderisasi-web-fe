import { afterEach, describe, expect, it, vi } from "vitest";
import { getClubs } from "./club";
import { getPublishedClubs } from "./club.cache";
import { getHomepageClubs } from "./homepage-clubs";
import type { Club } from "@/types/model/club";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock("./club", () => ({ getClubs: vi.fn(), getClub: vi.fn() }));

function club(id: number): Club {
  return {
    id,
    name: `Club ${id}`,
    club_type: "UNIT",
    description: "",
    short_description: null,
    logo: "",
    media: { items: [] },
    start_period: null,
    end_period: null,
    is_show: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  };
}

function page(
  data: Club[],
  currentPage = 1,
  lastPage = 1,
): Awaited<ReturnType<typeof getClubs>> {
  return {
    data,
    meta: {
      total: data.length,
      per_page: 50,
      current_page: currentPage,
      last_page: lastPage,
      first_page: 1,
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(getClubs).mockReset();
});

describe("Homepage clubs", () => {
  it("includes older clubs from every published page in the random selection", async () => {
    const recentClubs = Array.from({ length: 50 }, (_, index) =>
      club(60 - index),
    );
    const olderClubs = [club(10), club(9)];
    vi.mocked(getClubs)
      .mockResolvedValueOnce(page(recentClubs, 1, 2))
      .mockResolvedValueOnce(page(olderClubs, 2, 2));
    vi.spyOn(Math, "random").mockReturnValue(0.999);

    const selected = await getHomepageClubs();

    expect(getClubs).toHaveBeenNthCalledWith(1, { page: "1", per_page: "50" });
    expect(getClubs).toHaveBeenNthCalledWith(2, { page: "2", per_page: "50" });
    expect(selected).toHaveLength(4);
    expect(selected[0]?.id).toBe(9);
    expect(new Set(selected.map((item) => item.id)).size).toBe(4);
    expect(recentClubs[0]?.id).toBe(60);
    expect(olderClubs.map((item) => item.id)).toEqual([10, 9]);
  });

  it("selects again on subsequent requests using the same club list", async () => {
    vi.mocked(getClubs).mockResolvedValue(
      page([club(5), club(4), club(3), club(2), club(1)]),
    );
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    const first = await getHomepageClubs();
    random.mockReturnValue(0.999);
    const second = await getHomepageClubs();

    expect(first.map((item) => item.id)).toEqual([5, 4, 3, 2]);
    expect(second.map((item) => item.id)).toEqual([1, 5, 4, 3]);
  });

  it("returns every available club when fewer than four are published", async () => {
    vi.mocked(getClubs).mockResolvedValue(page([club(2), club(1)]));
    const selected = await getHomepageClubs();
    expect(selected.map((item) => item.id).sort()).toEqual([1, 2]);
  });

  it("handles an empty published list", async () => {
    vi.mocked(getClubs).mockResolvedValue(page([]));
    await expect(getHomepageClubs()).resolves.toEqual([]);
  });

  it("preserves page failures for the section error state", async () => {
    const error = new Error("Unavailable");
    vi.mocked(getClubs)
      .mockResolvedValueOnce(page([club(2)], 1, 2))
      .mockRejectedValueOnce(error);
    await expect(getPublishedClubs()).rejects.toBe(error);
  });
});
