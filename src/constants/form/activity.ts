import { ACTIVITY_CATEGORY_ENUM } from "@/types/constants/activity";

export const ACTIVITY_CATEGORY_OPTIONS = [
  { value: ACTIVITY_CATEGORY_ENUM.PELATIHAN, label: "Pelatihan" },
  { value: ACTIVITY_CATEGORY_ENUM.KADERISASI, label: "Kaderisasi" },
  { value: ACTIVITY_CATEGORY_ENUM.KEALUMNIAN, label: "Kealumnian" },
  { value: ACTIVITY_CATEGORY_ENUM.KEASRAMAAN, label: "Keasramaan" },
  { value: ACTIVITY_CATEGORY_ENUM.AKTUALISASI_DIRI, label: "Aktualisasi Diri" },
] as const;
