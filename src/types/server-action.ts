/**
 * Standard result type for server actions.
 *
 * This type should be used instead of throwing errors in server actions
 * because Next.js sanitizes error messages in production for security reasons.
 * By returning error data instead of throwing, the actual error messages
 * will reach the frontend even in production.
 */
export type ServerActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return defaultMessage;
}
