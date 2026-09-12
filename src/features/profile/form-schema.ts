import { z } from "zod";
import { profileHistorySchema } from "./history-schema";

const locationId = z
  .string()
  .regex(/^\d+$/, "Pilih lokasi yang tersedia.")
  .nullable();
export const profileFormSchema = profileHistorySchema
  .extend({
    name: z.string().trim().min(1, "Nama lengkap wajib diisi."),
    gender: z.enum(["M", "F"]).optional(),
    personal_id: z.string(),
    birth_date: z.iso.date("Tanggal lahir tidak valid.").nullable(),
    province_id: locationId,
    city_id: locationId,
    origin_province_id: locationId,
    origin_city_id: locationId,
    country: z.string().nullable(),
    whatsapp: z.string(),
    line: z.string(),
    linkedin: z.string(),
    instagram: z.string(),
    tiktok: z.string(),
    extra_data: z.looseObject({
      preferred_name: z.string(),
      current_activity_focus: z.array(
        z.enum([
          "professional",
          "academic",
          "social",
          "entrepreneur",
          "politics",
          "other",
        ]),
      ),
    }),
  })
  .superRefine((values, context) => {
    for (const [province, city] of [
      ["province_id", "city_id"],
      ["origin_province_id", "origin_city_id"],
    ] as const) {
      if (values[province] && !values[city])
        context.addIssue({
          code: "custom",
          path: [city],
          message: "Pilih kota / kabupaten untuk provinsi ini.",
        });
    }
  });

export function profileValidationErrors(
  values: unknown,
): Record<string, string> {
  const result = profileFormSchema.safeParse(values);
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ]),
      );
}
