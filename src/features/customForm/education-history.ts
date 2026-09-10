import type { EducationEntry } from "@/types/model/members";

export function selectCurrentEducation(
  history: EducationEntry[],
  selected: EducationEntry | undefined,
  selectedKey: string | null,
  editExisting = false,
): EducationEntry[] {
  if (selectedKey === "new" || history.length === 0) {
    return selected?.institution.trim()
      ? [...history, { ...selected }]
      : history;
  }
  if (selectedKey === null) return history;
  const index = Number(selectedKey);
  if (!Number.isInteger(index) || index < 0 || index >= history.length)
    return history;
  const entry = editExisting ? selected : history[index];
  if (!entry || !entry.institution.trim()) return history;
  return [...history.filter((_, i) => i !== index), { ...entry }];
}
