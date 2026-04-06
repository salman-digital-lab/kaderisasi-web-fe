import type { ZodType } from "zod";
import { z } from "zod";

import {
  onboardingFormBaseSchema,
  onboardingFormSchema,
} from "@/features/onboarding/schema";

import type { StepId } from "./types";

export const STEP_META = {
  mode: {
    label: "Pilihan",
    description: "Pilih cara melanjutkan",
  },
  credentials: {
    label: "Akun",
    description: "Email dan password",
  },
  personal: {
    label: "Data diri",
    description: "Informasi utama",
  },
  contact: {
    label: "Kontak",
    description: "Nomor dan sosial media",
  },
  address: {
    label: "Alamat",
    description: "Domisili dan asal",
  },
  education: {
    label: "Profil",
    description: "Pendidikan dan pekerjaan",
  },
  salman: {
    label: "Salman",
    description: "Aktivitas dan fokus",
  },
  kaderisasi: {
    label: "Kaderisasi",
    description: "Alur kaderisasi",
  },
  review: {
    label: "Tinjau",
    description: "Periksa sebelum kirim",
  },
} as const satisfies Record<
  StepId,
  {
    label: string;
    description: string;
  }
>;

export const stepSchemas: Record<StepId, ZodType<unknown>> = {
  mode: z.object({
    mode: z.enum(["account", "login", "no_account"]),
  }),
  credentials: onboardingFormBaseSchema.pick({
    mode: true,
    email: true,
    password: true,
    confirmPassword: true,
  }),
  personal: onboardingFormBaseSchema.pick({
    name: true,
    preferredName: true,
    gender: true,
    birthDate: true,
  }),
  contact: onboardingFormBaseSchema.pick({
    whatsapp: true,
    instagram: true,
    tiktok: true,
    linkedin: true,
  }),
  address: onboardingFormBaseSchema.pick({
    provinceId: true,
    cityId: true,
    originProvinceId: true,
    originCityId: true,
    country: true,
  }),
  education: onboardingFormBaseSchema.pick({
    educationHistory: true,
    workHistory: true,
    currentActivityFocus: true,
  }),
  salman: onboardingFormBaseSchema.pick({
    salmanActivityHistory: true,
  }),
  kaderisasi: onboardingFormBaseSchema.pick({
    kaderisasiParticipation: true,
    sscGeneration: true,
    lmdGeneration: true,
    spectraGeneration: true,
  }),
  review: onboardingFormSchema,
};
