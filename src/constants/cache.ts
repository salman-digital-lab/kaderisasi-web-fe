/**
 * Centralized cache tag constants
 * Used with cacheTag() in 'use cache' functions for targeted invalidation
 */
export const CACHE_TAGS = {
  /** All activities list */
  ACTIVITIES: "activities",

  /** Single activity by slug */
  ACTIVITY: (slug: string) => `activity-${slug}`,

  /** Activity categories */
  ACTIVITY_CATEGORIES: "activity-categories",

  /** All clubs list */
  CLUBS: "clubs",

  /** Single club by id */
  CLUB: (id: number | string) => `club-${id}`,

  /** Monthly leaderboard */
  LEADERBOARD_MONTHLY: "leaderboard-monthly",

  /** Lifetime leaderboard */
  LEADERBOARD_LIFETIME: "leaderboard-lifetime",

  /** Province reference data */
  PROVINCES: "provinces",
} as const;
