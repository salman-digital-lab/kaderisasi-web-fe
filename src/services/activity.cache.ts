"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache";
import {
  getActivityCategories as _getActivityCategories,
  getActivities as _getActivities,
  getActivity as _getActivity,
} from "./activity";
import type { GetActivitiesReq, GetActivityReq } from "@/types/api/activity";
import { FetcherError } from "@/functions/common/fetcher";
import type { Activity } from "@/types/model/activity";

export async function getActivityCategories() {
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ACTIVITY_CATEGORIES);
  return _getActivityCategories();
}

export async function getActivities(props: GetActivitiesReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ACTIVITIES);
  try {
    return await _getActivities(props);
  } catch {
    return {
      meta: {
        total: 0,
        per_page: 0,
        current_page: 1,
        last_page: 0,
        first_page: 1,
      },
      data: [],
    };
  }
}

export async function getActivity(props: GetActivityReq) {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ACTIVITIES, CACHE_TAGS.ACTIVITY(props.slug));
  return _getActivity(props);
}

export async function getActivityDetail(
  props: GetActivityReq,
): Promise<Activity | null> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ACTIVITIES, CACHE_TAGS.ACTIVITY(props.slug));
  try {
    return await _getActivity(props);
  } catch (error) {
    // Handle HTTP status before errors are serialized across the cache boundary.
    if (error instanceof FetcherError && error.status === 404) return null;
    throw error;
  }
}
