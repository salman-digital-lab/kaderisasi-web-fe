"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import { FetcherError } from "@/functions/common/fetcher";
import { getClubs as _getClubs, getClub as _getClub } from "./club";
import type { GetClubsReq, GetClubReq } from "@/types/api/club";

/**
 * Cached wrapper for getClubs.
 * List refreshes every few minutes.
 */
export async function getClubs(props: GetClubsReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.CLUBS);
  return _getClubs(props);
}

/**
 * Cached wrapper for getClub.
 * Individual club data cached for minutes, tagged for targeted invalidation.
 */
export async function getClub(props: GetClubReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.CLUBS, CACHE_TAGS.CLUB(props.id));

  try {
    return await _getClub(props);
  } catch (error: unknown) {
    if (error instanceof FetcherError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
