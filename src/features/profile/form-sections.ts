import type { ProfileFormValues } from "./form-values";

export type ProfileSectionId =
  | "identity"
  | "domicile"
  | "origin"
  | "contact"
  | "education"
  | "work"
  | "focus";

type SectionDefinition = {
  id: ProfileSectionId;
  title: string;
  /** Form paths owned by this section (prefix match for list fields). */
  fields: string[];
};

export const PROFILE_FORM_SECTIONS: SectionDefinition[] = [
  {
    id: "identity",
    title: "Identitas",
    fields: [
      "name",
      "extra_data.preferred_name",
      "gender",
      "birth_date",
      "personal_id",
    ],
  },
  {
    id: "domicile",
    title: "Domisili",
    fields: ["province_id", "city_id", "country"],
  },
  {
    id: "origin",
    title: "Asal daerah",
    fields: ["origin_province_id", "origin_city_id"],
  },
  {
    id: "contact",
    title: "Kontak dan media sosial",
    fields: ["whatsapp", "line", "linkedin", "instagram", "tiktok"],
  },
  { id: "education", title: "Pendidikan", fields: ["education_history"] },
  { id: "work", title: "Pekerjaan / aktivitas", fields: ["work_history"] },
  {
    id: "focus",
    title: "Fokus aktivitas",
    fields: ["extra_data.current_activity_focus"],
  },
];

/** Section that owns a form path such as `work_history.0.company`. */
export function sectionForField(path: string): ProfileSectionId | undefined {
  return PROFILE_FORM_SECTIONS.find((section) =>
    section.fields.some(
      (field) => path === field || path.startsWith(`${field}.`),
    ),
  )?.id;
}

function readPath(values: ProfileFormValues, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      values,
    );
}

function filled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return value !== null && value !== undefined;
}

export function sectionHasData(
  id: ProfileSectionId,
  values: ProfileFormValues,
): boolean {
  const section = PROFILE_FORM_SECTIONS.find((item) => item.id === id);
  return Boolean(
    section?.fields.some((field) => filled(readPath(values, field))),
  );
}

/** Identity always starts open; other sections open when they hold data. */
export function initialOpenSections(
  values: ProfileFormValues,
): ProfileSectionId[] {
  return PROFILE_FORM_SECTIONS.filter(
    (section) =>
      section.id === "identity" || sectionHasData(section.id, values),
  ).map((section) => section.id);
}
