/**
 * Centralized cache/revalidation configuration
 * Use these constants in fetcher calls for consistency
 */
export const CACHE = {
  /** Activities list and details - 1 minute */
  ACTIVITIES: 60,

  /** Clubs list and details - 1 minute */
  CLUBS: 60,

  /** Static content - 1 hour */
  STATIC: 3600,

  /** User-specific data - no caching */
  USER_DATA: 0,

  /** Leaderboard data - 5 minutes */
  LEADERBOARD: 300,
} as const;

export type CacheConfig = (typeof CACHE)[keyof typeof CACHE];
