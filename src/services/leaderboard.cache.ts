"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import {
  getMonthlyLeaderboard as _getMonthlyLeaderboard,
} from "./leaderboard";

/**
 * Cached wrapper for getMonthlyLeaderboard.
 * Leaderboard data refreshes every few minutes.
 * Args (page, perPage, month) automatically become part of the cache key.
 */
export async function getMonthlyLeaderboard(
  page: number = 1,
  perPage: number = 10,
  month: string,
) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.LEADERBOARD_MONTHLY);
  return _getMonthlyLeaderboard(page, perPage, month);
}
