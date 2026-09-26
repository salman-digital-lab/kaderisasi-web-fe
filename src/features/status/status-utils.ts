function timestamp(value: string | undefined): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

export function statusLabel(status: string): string {
  return status.charAt(0) + status.slice(1).toLocaleLowerCase("id-ID");
}

export function formatStatusDate(
  value: string | undefined,
  includeTime = false,
): string | null {
  const time = timestamp(value);
  if (time === null) return null;
  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
    ...(includeTime ? ({ hour: "2-digit", minute: "2-digit" } as const) : {}),
  }).format(time);
  return includeTime ? `${formatted} WIB` : formatted;
}
