import { z } from "zod";

/**
 * Server-side environment variables schema
 * These are only available on the server
 */
const serverEnvSchema = z.object({
  SERVER_BE_API: z.url().optional(),
  SERVER_BE_ADMIN_API: z.url().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Client-side environment variables schema
 * These are exposed to the browser (NEXT_PUBLIC_*)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_BE_API: z.url(),
  NEXT_PUBLIC_BE_ADMIN_API: z.url(),
  NEXT_PUBLIC_IMAGE_BASE_URL: z.url(),
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.url(),
});

/**
 * Validate and export server environment variables
 * Only call this on the server
 */
export const serverEnv = () => {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid server environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
};

/**
 * Validate and export client environment variables
 * Safe to use on both server and client
 */
export const clientEnv = () => {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_BE_API: process.env.NEXT_PUBLIC_BE_API,
    NEXT_PUBLIC_BE_ADMIN_API: process.env.NEXT_PUBLIC_BE_ADMIN_API,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid client environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
};

// Type exports for use throughout the app
export type ServerEnv = ReturnType<typeof serverEnv>;
export type ClientEnv = ReturnType<typeof clientEnv>;
