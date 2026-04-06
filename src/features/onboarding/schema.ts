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
  {
    label: "PRAMUKA: Pramuka Pangkalan Masjid Salman ITB",
    value: "PRAMUKA: Pramuka Pangkalan Masjid Salman ITB",
  },
  {
    label: "PUSTENA: Pusat Teknologi Tepat Guna",
    value: "PUSTENA: Pusat Teknologi Tepat Guna",
  },
  {
    label: "SKAU: Salman Komunikasi Aspirasi Ummat",
    value: "SKAU: Salman Komunikasi Aspirasi Ummat",
  },
  {
    label: "SMC: Salman Media Center",
    value: "SMC: Salman Media Center",
  },
  {
    label:
      "AKSARA: Aksara Salman ITB (Unit yang bergerak di bidang literasi dan jurnalistik)",
    value:
      "AKSARA: Aksara Salman ITB (Unit yang bergerak di bidang literasi dan jurnalistik)",
  },
  {
    label: "KARISMA: Keluarga Remaja Islam Salman ITB",
    value: "KARISMA: Keluarga Remaja Islam Salman ITB",
  },
  {
    label:
      "BIMBEL: Bimbingan Belajar (Program bimbingan belajar yang dikelola Salman/Karisma)",
    value:
      "BIMBEL: Bimbingan Belajar (Program bimbingan belajar yang dikelola Salman/Karisma)",
  },
  {
    label: "PAS: Pembinaan Anak-anak Salman",
    value: "PAS: Pembinaan Anak-anak Salman",
  },
  {
    label: "BIOTER: Biologi Terapan",
    value: "BIOTER: Biologi Terapan",
  },
  {
    label: "BASIS: Basis ITB (Lembaga pengkaderan/pembinaan di Salman)",
    value: "BASIS: Basis ITB (Lembaga pengkaderan/pembinaan di Salman)",
  },
  {
    label: "KORSA: Korps Relawan Salman ITB",
    value: "KORSA: Korps Relawan Salman ITB",
  },
  {
    label: "REKLAMASA: Reklame Kreasi Masa Salman ITB",
    value: "REKLAMASA: Reklame Kreasi Masa Salman ITB",
  },
  {
    label: "NASA: Naungan Musik Islami Salman",
    value: "NASA: Naungan Musik Islami Salman",
  },
  {
    label: "LIKESA: Lingkar Kreatif Salman",
    value: "LIKESA: Lingkar Kreatif Salman",
  },
  {
    label: "SAFOCA: Salman Football Club Academy",
    value: "SAFOCA: Salman Football Club Academy",
  },
  {
    label: "UPTQ: Unit Pengembangan Tilawatil Qur'an",
    value: "UPTQ: Unit Pengembangan Tilawatil Qur'an",
  },
  {
    label: "MTQ: Musabaqah Tilawatil Qur'an",
    value: "MTQ: Musabaqah Tilawatil Qur'an",
  },
  {
    label: "Keluarga Mahasiswa Islam (Gamais) ITB",
    value: "Keluarga Mahasiswa Islam (Gamais) ITB",
  },
  {
    label: "Keluarga Mahasiswa Islam (Kamil) Pascasarjana ITB",
    value: "Keluarga Mahasiswa Islam (Kamil) Pascasarjana ITB",
  },
  {
    label: "Salman Entrepreneur Club (SEC)",
    value: "Salman Entrepreneur Club (SEC)",
  },
  {
    label: "Salman Archery Community (SAC)",
    value: "Salman Archery Community (SAC)",
  },
  {
    label: "YIM: Young Intellectual Moslem",
    value: "YIM: Young Intellectual Moslem",
  },
  {
    label:
      "P3R/P3I/P3RI: Panitia Pelaksana Program Ramadhan (P3R) / Iduladha (P3I) / Ramadhan dan Iduladha (P3RI)",
    value:
      "P3R/P3I/P3RI: Panitia Pelaksana Program Ramadhan (P3R) / Iduladha (P3I) / Ramadhan dan Iduladha (P3RI)",
  },
  {
    label: "MAJALAH YANG MUDA",
    value: "MAJALAH YANG MUDA",
  },
  {
    label: "Latihan Mujahid Dakwah (LMD)",
    value: "Latihan Mujahid Dakwah (LMD)",
  },
  {
    label: "Salman Spiritual Camp / ITB Spiritual Camp",
    value: "Salman Spiritual Camp / ITB Spiritual Camp",
  },
  {
    label: "Spiritual Entrepreneurial Civilizer Training (SPECTRA)",
    value: "Spiritual Entrepreneurial Civilizer Training (SPECTRA)",
  },
  {
    label: "Asrama Salman ITB",
    value: "Asrama Salman ITB",
  },
  {
    label: "Rumah Sahabat Muda",
    value: "Rumah Sahabat Muda",
  },
  {
    label: "Asrama Pemberdayaan Rumah Sahabat",
    value: "Asrama Pemberdayaan Rumah Sahabat",
  },
  {
    label: "Salman Film",
    value: "Salman Film",
  },
  {
    label: "Forum Filmmaker Pelajar Bandung (F2PB)",
    value: "Forum Filmmaker Pelajar Bandung (F2PB)",
  },
];

export const currentActivityFocusOptions = [
  { value: "professional", label: "Profesional" },
  { value: "academic", label: "Akademik" },
  { value: "social", label: "Sosial" },
  { value: "entrepreneur", label: "Wirausaha" },
  { value: "politics", label: "Politik" },
] as const;

export const kaderisasiParticipationOptions = [
  { value: "ssc", label: "SSC/ITBSC" },
  { value: "lmd", label: "LMD" },
  { value: "spectra", label: "SPECTRA" },
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
    faculty: z.string().trim().min(1, "Fakultas wajib diisi"),
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
  kaderisasiParticipation: z.array(
    z.enum(["ssc", "lmd", "spectra"] as const),
  ),
  sscGeneration: z.number().int().min(1).nullable(),
  lmdGeneration: z.number().int().min(1).nullable(),
  spectraGeneration: z.number().int().min(1).nullable(),
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
  kaderisasiParticipation: [],
  sscGeneration: null,
  lmdGeneration: null,
  spectraGeneration: null,
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
        "kaderisasi",
        "review",
      ]
    : [
        "mode",
        "personal",
        "contact",
        "address",
        "education",
        "salman",
        "kaderisasi",
        "review",
      ];
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
    faculty: normalizeString(entry.faculty),
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
      kaderisasi_path:
        values.kaderisasiParticipation.length > 0
          ? {
              ssc: values.kaderisasiParticipation.includes("ssc")
                ? values.sscGeneration
                : undefined,
              lmd: values.kaderisasiParticipation.includes("lmd")
                ? values.lmdGeneration
                : undefined,
              spectra: values.kaderisasiParticipation.includes("spectra")
                ? values.spectraGeneration
                : undefined,
            }
          : undefined,
    },
  };
}

export function buildNoAccountProfilePayload(values: OnboardingFormValues) {
  return {
    ...buildAccountProfilePayload(values),
  };
}
