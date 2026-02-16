"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import { getClubs as _getClubs, getClub as _getClub } from "./club";
import type { GetClubsReq, GetClubReq } from "@/types/api/club";

/**
 * Cached wrapper for getClubs.
 * List refreshes every few minutes.
 */
export async function getClubs(props: GetClubsReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.CLUBS);
  try {
    return await _getClubs(props);
  } catch {
    return { meta: {} as any, data: [] };
  }
}

/**
 * Cached wrapper for getClub.
 * Individual club data cached for minutes, tagged for targeted invalidation.
 */
export async function getClub(props: GetClubReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.CLUBS, CACHE_TAGS.CLUB(props.id));
  return _getClub(props);
}
