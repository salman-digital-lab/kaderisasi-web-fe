import dayjs from "dayjs";
import "dayjs/locale/id";

export function formatActivityDate(value: string | null | undefined): string {
  return value && dayjs(value).isValid()
    ? dayjs(value).locale("id").format("D MMMM YYYY")
    : "Belum ditentukan";
}

export function formatActivityDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start || !dayjs(start).isValid()) return "Jadwal belum ditentukan";
  if (!end || !dayjs(end).isValid() || dayjs(start).isSame(end, "day"))
    return formatActivityDate(start);
  return `${formatActivityDate(start)} – ${formatActivityDate(end)}`;
}
