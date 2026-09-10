export function courseHref(id: number): string {
  return `/kelas/${id}`;
}
export function lessonHref(id: number, lessonId: number): string {
  return `/kelas/${id}/materi/${lessonId}`;
}
export function courseListHref(search = "", page = 1): string {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (page > 1) query.set("page", String(page));
  return `/kelas${query.size ? `?${query}` : ""}`;
}
export function completionPercentage(completed: number, total: number): number {
  return total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
}
export const COURSE_LEVEL_LABELS: Record<number, string> = {
  0: "Jamaah",
  3: "Aktivis",
  6: "Kader",
  10: "Kader Lanjut",
};
