export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  link_label: string | null;
  link_url: string | null;
  published_at: string;
  read_at: string | null;
}
export interface InboxPage {
  items: NotificationItem[];
  next_cursor: string;
  cutoff: string;
}
export class NotificationError extends Error {
  constructor(public status: number) {
    super("Notifikasi gagal dimuat");
  }
}
export async function notificationRequest<T>(
  path = "",
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`/api/notifications${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new NotificationError(response.status);
  const result = (await response.json()) as { data: T };
  return result.data;
}
export function notificationChanged(): void {
  window.dispatchEvent(new Event("notifications-changed"));
}
