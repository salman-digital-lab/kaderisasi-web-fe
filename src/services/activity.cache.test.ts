import { describe, expect, it, vi } from "vitest";
import { FetcherError } from "@/functions/common/fetcher";
import { getActivity } from "./activity";
import { getActivityDetail } from "./activity.cache";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock("./activity", () => ({
  getActivity: vi.fn(),
  getActivities: vi.fn(),
  getActivityCategories: vi.fn(),
}));

describe("Activity detail cache", () => {
  it("returns a serializable missing value before crossing the cache boundary", async () => {
    vi.mocked(getActivity).mockRejectedValue(
      new FetcherError("Not found", 404),
    );
    await expect(getActivityDetail({ slug: "missing" })).resolves.toBeNull();
  });

  it("preserves service failures for the retry boundary", async () => {
    const error = new FetcherError("Unavailable", 503);
    vi.mocked(getActivity).mockRejectedValue(error);
    await expect(getActivityDetail({ slug: "unavailable" })).rejects.toBe(
      error,
    );
  });
});
