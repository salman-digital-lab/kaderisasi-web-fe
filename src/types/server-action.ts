/**
 * Standard result type for server actions.
 *
 * This type should be used instead of throwing errors in server actions
 * because Next.js sanitizes error messages in production for security reasons.
 * By returning error data instead of throwing, the actual error messages
 * will reach the frontend even in production.
 *
 * @example
 * ```typescript
 * // In a server action:
 * export default async function myAction(data: MyData): Promise<ServerActionResult<MyResponse>> {
 *   try {
 *     const response = await someService(data);
 *     return {
 *       success: true,
 *       message: "Operation successful",
 *       data: response.data,
 *     };
 *   } catch (error) {
 *     return {
 *       success: false,
 *       message: typeof error === "string" ? error : "An error occurred",
 *     };
 *   }
 * }
 *
 * // In a client component:
 * const response = await myAction(formData);
 * if (!response.success) {
 *   showNotification(response.message, "error");
 *   return;
 * }
 * // Handle success with response.data
 * ```
 */
export type ServerActionResult<T = unknown> = {
  /** Whether the operation was successful */
  success: boolean;
  /** A message describing the result (success message or error message) */
  message: string;
  /** Optional data returned from the operation (only on success) */
  data?: T;
};

/**
 * Helper function to extract error message from unknown error type.
 * Useful in catch blocks to standardize error handling.
 */
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
