"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import { getProvinces as _getProvinces, getCountries as _getCountries } from "./profile";

/**
 * Cached wrapper for getProvinces.
 * Province data almost never changes — cached with max lifetime.
 */
export async function getProvinces() {
  cacheLife("max");
  cacheTag(CACHE_TAGS.PROVINCES);
  return _getProvinces();
}

/**
 * Cached wrapper for getCountries.
 * Country data almost never changes — cached with max lifetime.
 */
export async function getCountries() {
  cacheLife("max");
  cacheTag(CACHE_TAGS.COUNTRIES);
  return _getCountries();
}
