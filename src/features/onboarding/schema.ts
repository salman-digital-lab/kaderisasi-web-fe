import { z } from "zod";

import { GENDER } from "@/types/constants/profile";

const CURRENT_ACTIVITY_FOCUS_VALUES = [
  "professional",
  "academic",
  "social",
  "entrepreneur",
  "politics",
] as const;

export const salmanActivityHistoryOptions = [
  { value: "mentoring", label: "Mentoring/kelompok bina" },
  { value: "kajian", label: "Kajian atau halaqah" },
  { value: "kepanitiaan", label: "Kepanitiaan kegiatan" },
  { value: "organisasi", label: "Organisasi kampus/komunitas" },
  { value: "volunteer", label: "Relawan atau pelayanan sosial" },
];

export const currentActivityFocusOptions = [
  { value: "professional", label: "Profesional" },
  { value: "academic", label: "Akademik" },
  { value: "social", label: "Sosial" },
  { value: "entrepreneur", label: "Wirausaha" },
  { value: "politics", label: "Politik" },
] as const;

export const degreeOptions = [
  { value: "bachelor", label: "S1 (Sarjana)" },
  { value: "master", label: "S2 (Magister)" },
  { value: "doctoral", label: "S3 (Doktor)" },
] as const;

const educationEntrySchema = z
  .object({
    degree: z.enum(["bachelor", "master", "doctoral"]),
    institution: z.string().trim().min(1, "Institusi wajib diisi"),
    major: z.string().trim().min(1, "Jurusan wajib diisi"),
    intakeYear: z
      .number()
      .int("Tahun masuk tidak valid")
      .min(1950, "Tahun masuk tidak valid")
      .max(new Date().getFullYear() + 5, "Tahun masuk tidak valid")
      .nullable(),
  })
  .superRefine((value, context) => {
    if (value.intakeYear === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["intakeYear"],
        message: "Tahun masuk wajib diisi",
      });
    }
  });

const workEntrySchema = z
  .object({
    jobTitle: z.string().trim().default(""),
    company: z.string().trim().default(""),
    startYear: z
      .number()
      .int("Tahun mulai tidak valid")
      .min(1950, "Tahun mulai tidak valid")
      .max(new Date().getFullYear() + 5, "Tahun mulai tidak valid")
      .nullable(),
    endYear: z
      .number()
      .int("Tahun selesai tidak valid")
      .min(1950, "Tahun selesai tidak valid")
      .max(new Date().getFullYear() + 5, "Tahun selesai tidak valid")
      .nullable(),
  })
  .superRefine((value, context) => {
    const hasAnyValue =
      value.jobTitle !== "" ||
      value.company !== "" ||
      value.startYear !== null ||
      value.endYear !== null;

    if (!hasAnyValue) {
      return;
    }

    if (value.jobTitle === "") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jobTitle"],
        message: "Posisi/jabatan wajib diisi",
      });
    }

    if (value.company === "") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company"],
        message: "Nama tempat wajib diisi",
      });
    }

    if (
      value.startYear !== null &&
      value.endYear !== null &&
      value.endYear < value.startYear
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endYear"],
        message: "Tahun selesai tidak boleh lebih kecil dari tahun mulai",
      });
    }
  });

export const onboardingFormBaseSchema = z.object({
  mode: z.enum(["account", "login", "no_account"]),
  email: z.string().trim().default(""),
  password: z.string().default(""),
  confirmPassword: z.string().default(""),
  name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  preferredName: z.string().trim().default(""),
  gender: z.nativeEnum(GENDER, {
    error: "Pilih jenis kelamin",
  }),
  whatsapp: z.string().trim().min(1, "Nomor WhatsApp wajib diisi"),
  instagram: z.string().trim().default(""),
  tiktok: z.string().trim().default(""),
  linkedin: z.string().trim().default(""),
  birthDate: z.date().nullable(),
  provinceId: z.string().trim().default(""),
  cityId: z.string().trim().default(""),
  originProvinceId: z.string().trim().min(1, "Pilih provinsi asal"),
  originCityId: z.string().trim().min(1, "Pilih kota/kabupaten asal"),
  country: z.string().trim().default(""),
  educationHistory: z.array(educationEntrySchema),
  workHistory: z.array(workEntrySchema),
  salmanActivityHistory: z.array(z.string()),
  currentActivityFocus: z.array(z.enum(CURRENT_ACTIVITY_FOCUS_VALUES)),
});

export const onboardingFormSchema = onboardingFormBaseSchema.superRefine(
  (value, context) => {
    if (value.country === "ID") {
      if (value.provinceId === "") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provinceId"],
          message: "Pilih provinsi domisili",
        });
      }

      if (value.cityId === "") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cityId"],
          message: "Pilih kota/kabupaten domisili",
        });
      }
    }

    if (value.mode === "account" || value.mode === "login") {
      if (value.email === "") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Email wajib diisi",
        });
      } else {
        const emailCheck = z.email().safeParse(value.email);
        if (!emailCheck.success) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "Format email tidak valid",
          });
        }
      }

      if (value.mode === "account" && value.password.length < 8) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password minimal 8 karakter",
        });
      }

      if (value.mode === "login" && value.password.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password wajib diisi",
        });
      }

      if (
        value.mode === "account" &&
        value.confirmPassword !== value.password
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Konfirmasi password tidak sama",
        });
      }
    }
  },
);

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export type OnboardingDraft = {
  version: number;
  currentStep: number;
  values: OnboardingFormValues;
};

export const ONBOARDING_DRAFT_VERSION = 1;
export const ONBOARDING_STORAGE_KEY = "onboarding-v1";

export const onboardingInitialValues: OnboardingFormValues = {
  mode: "account",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  preferredName: "",
  gender: GENDER.Male,
  whatsapp: "",
  instagram: "",
  tiktok: "",
  linkedin: "",
  birthDate: null,
  provinceId: "",
  cityId: "",
  originProvinceId: "",
  originCityId: "",
  country: "",
  educationHistory: [],
  workHistory: [],
  salmanActivityHistory: [],
  currentActivityFocus: [],
};

export function getVisibleStepIds(mode: OnboardingFormValues["mode"]) {
  return mode === "account" || mode === "login"
    ? [
        "mode",
        "credentials",
        "personal",
        "contact",
        "address",
        "education",
        "salman",
        "review",
      ]
    : ["mode", "personal", "contact", "address", "education", "salman", "review"];
}

function normalizeString(value: string) {
  return value.trim();
}

function normalizeOptionalString(value: string) {
  const normalized = value.trim();
  return normalized === "" ? undefined : normalized;
}

function normalizeId(value: string) {
  const normalized = value.trim();
  return normalized === "" ? undefined : Number(normalized);
}

function normalizeEducationEntries(values: OnboardingFormValues) {
  return values.educationHistory.map((entry) => ({
    degree: entry.degree,
    institution: normalizeString(entry.institution),
    major: normalizeString(entry.major),
    intake_year: entry.intakeYear as number,
  }));
}

function normalizeWorkEntries(values: OnboardingFormValues) {
  return values.workHistory
    .filter(
      (entry) =>
        entry.jobTitle.trim() !== "" ||
        entry.company.trim() !== "" ||
        entry.startYear !== null ||
        entry.endYear !== null,
    )
    .map((entry) => ({
      job_title: normalizeString(entry.jobTitle),
      company: normalizeString(entry.company),
      start_year: entry.startYear ?? undefined,
      end_year: entry.endYear ?? undefined,
    }));
}

export function buildAccountProfilePayload(values: OnboardingFormValues) {
  return {
    name: normalizeString(values.name),
    gender: values.gender,
    whatsapp: normalizeString(values.whatsapp),
    instagram: normalizeOptionalString(values.instagram),
    tiktok: normalizeOptionalString(values.tiktok),
    linkedin: normalizeOptionalString(values.linkedin),
    birth_date: values.birthDate?.toISOString().split("T")[0],
    province_id: normalizeId(values.provinceId),
    city_id: normalizeId(values.cityId),
    origin_province_id: normalizeId(values.originProvinceId),
    origin_city_id: normalizeId(values.originCityId),
    country: normalizeOptionalString(values.country),
    education_history: normalizeEducationEntries(values),
    work_history: normalizeWorkEntries(values),
    extra_data: {
      preferred_name: normalizeOptionalString(values.preferredName),
      salman_activity_history:
        values.salmanActivityHistory.length > 0
          ? values.salmanActivityHistory
          : undefined,
      current_activity_focus:
        values.currentActivityFocus.length > 0
          ? values.currentActivityFocus
          : undefined,
    },
  };
}

export function buildNoAccountProfilePayload(values: OnboardingFormValues) {
  return {
    ...buildAccountProfilePayload(values),
  };
}
