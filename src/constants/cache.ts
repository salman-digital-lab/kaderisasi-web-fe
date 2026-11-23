/**
 * Centralized cache tag constants
 * Used with cacheTag() in 'use cache' functions for targeted invalidation
 */
export const CACHE_TAGS = {
  ACTIVITIES: "activities",

  ACTIVITY: (slug: string) => `activity-${slug}`,

  ACTIVITY_CATEGORIES: "activity-categories",

  CLUBS: "clubs",

  CLUB: (id: number | string) => `club-${id}`,

  LEADERBOARD_MONTHLY: "leaderboard-monthly",

  PROVINCES: "provinces",

  COUNTRIES: "countries",
} as const;
