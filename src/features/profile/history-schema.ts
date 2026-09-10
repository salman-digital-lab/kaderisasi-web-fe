import { z } from "zod";

const optionalYear = z.preprocess(
  (value) => value === "" || value === null ? undefined : value,
  z.coerce.number().int("Tahun harus berupa bilangan bulat")
    .min(1900, "Tahun tidak valid")
    .max(new Date().getFullYear() + 10, "Tahun tidak valid")
    .optional(),
);

export const educationEntrySchema = z.object({
  degree: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.enum(["bachelor", "master", "doctoral"]).optional(),
  ),
  institution: z.string().trim().default(""),
  faculty: z.string().trim().default(""),
  major: z.string().trim().default(""),
  intake_year: optionalYear,
});

export const workEntrySchema = z.object({
  job_title: z.string().trim().min(1, "Posisi/jabatan wajib diisi"),
  company: z.string().trim().min(1, "Nama tempat wajib diisi"),
  start_year: optionalYear,
  end_year: optionalYear,
}).refine(
  (entry) => entry.start_year === undefined || entry.end_year === undefined ||
    entry.end_year >= entry.start_year,
  { path: ["end_year"], message: "Tahun selesai tidak boleh lebih kecil dari tahun mulai" },
);

export const profileHistorySchema = z.object({
  education_history: z.array(educationEntrySchema).optional(),
  work_history: z.array(workEntrySchema).optional(),
});

export function historyValidationErrors(values: unknown): Record<string, string> {
  const result = profileHistorySchema.safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(result.error.issues.map((issue) => [
    issue.path.join("."), issue.message,
  ]));
}
