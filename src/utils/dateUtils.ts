/**
 * Safely converts a Date object or date string to YYYY-MM-DD format.
 * Handles both Date objects and string values from Mantine DateInput.
 */
export function toISODateString(
  value: Date | string | null | undefined,
): string | undefined {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return !isNaN(parsed.getTime())
      ? parsed.toISOString().split("T")[0]
      : value;
  }

  return undefined;
}
