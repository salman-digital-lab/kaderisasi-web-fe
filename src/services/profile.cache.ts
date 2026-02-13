"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import { getProvinces as _getProvinces } from "./profile";

/**
 * Cached wrapper for getProvinces.
 * Province data almost never changes — cached with max lifetime.
 */
export async function getProvinces() {
  cacheLife("max");
  cacheTag(CACHE_TAGS.PROVINCES);
  return _getProvinces();
}
