import { getApiConfig } from "@/config/apiConfig";
import type { CalendarEvent } from "@/types/model/calendar";

export async function getCalendarEvents(
  start: string,
  end: string,
  signal: AbortSignal,
): Promise<CalendarEvent[]> {
  const { beAdminApi } = getApiConfig();
  const params = new URLSearchParams({ start, end });
  const response = await fetch(`${beAdminApi}/calendar-events?${params}`, {
    signal,
    cache: "no-store",
    credentials: "omit",
  });
  if (!response.ok) throw new Error("CALENDAR_LOAD_FAILED");
  const result = (await response.json()) as { data: CalendarEvent[] };
  return result.data;
}
