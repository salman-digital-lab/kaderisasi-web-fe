/**
 * API Configuration
 *
 * Provides correct API URLs based on the execution context:
 * - Server-side: Use internal Docker network URLs (SERVER_* env vars)
 * - Client-side: Use public URLs (NEXT_PUBLIC_* env vars)
 */

export const getApiConfig = () => {
  const isServer = typeof window === "undefined";

  return {
    // Main API endpoint
    beApi: isServer
      ? process.env.SERVER_BE_API || process.env.NEXT_PUBLIC_BE_API
      : process.env.NEXT_PUBLIC_BE_API,

    // Admin API endpoint
    beAdminApi: isServer
      ? process.env.SERVER_BE_ADMIN_API || process.env.NEXT_PUBLIC_BE_ADMIN_API
      : process.env.NEXT_PUBLIC_BE_ADMIN_API,

    // Image base URL (always public, accessed by browser)
    imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,

    // App URL (always public)
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  };
};

// For direct imports in server-only contexts (e.g., 'use server' functions, sitemap)
export const serverApiConfig = {
  beApi: process.env.SERVER_BE_API || process.env.NEXT_PUBLIC_BE_API,
  beAdminApi:
    process.env.SERVER_BE_ADMIN_API || process.env.NEXT_PUBLIC_BE_ADMIN_API,
};

// For direct imports in client-only contexts
export const clientApiConfig = {
  beApi: process.env.NEXT_PUBLIC_BE_API,
  beAdminApi: process.env.NEXT_PUBLIC_BE_ADMIN_API,
};
