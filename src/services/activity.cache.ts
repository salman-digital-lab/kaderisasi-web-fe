"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import {
  getActivityCategories as _getActivityCategories,
  getActivities as _getActivities,
  getActivity as _getActivity,
} from "./activity";
import type { GetActivitiesReq, GetActivityReq } from "@/types/api/activity";

/**
 * Cached wrapper for getActivityCategories.
 * Categories rarely change — cached for hours.
 */
export async function getActivityCategories() {
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ACTIVITY_CATEGORIES);
  return _getActivityCategories();
}

/**
 * Cached wrapper for getActivities.
 * List refreshes every few minutes.
 * Props (page, per_page, etc.) automatically become part of the cache key.
 */
export async function getActivities(props: GetActivitiesReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ACTIVITIES);
  return _getActivities(props);
}

/**
 * Cached wrapper for getActivity.
 * Individual activity data cached for minutes, tagged for targeted invalidation.
 */
export async function getActivity(props: GetActivityReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ACTIVITIES, CACHE_TAGS.ACTIVITY(props.slug));
  return _getActivity(props);
}
