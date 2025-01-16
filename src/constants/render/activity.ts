import { ACTIVITY_CATEGORY_ENUM } from "@/types/constants/activity";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";

export const ACTIVITY_CATEGORY_RENDER = {
  [ACTIVITY_CATEGORY_ENUM.PELATIHAN]: "Pelatihan",
  [ACTIVITY_CATEGORY_ENUM.KADERISASI]: "Kaderisasi",
  [ACTIVITY_CATEGORY_ENUM.AKTUALISASI_DIRI]: "Aktualisasi Diri",
  [ACTIVITY_CATEGORY_ENUM.KEALUMNIAN]: "Kealumnian",
  [ACTIVITY_CATEGORY_ENUM.KEASRAMAAN]: "Keasramaan",
} as const;

export const USER_LEVEL_RENDER = {
  [USER_LEVEL_ENUM.JAMAAH]: "Jamaah",
  [USER_LEVEL_ENUM.AKTIVIS]: "Aktivis",
  [USER_LEVEL_ENUM.AKTIVIS_KK]: "Aktivis KK",
  [USER_LEVEL_ENUM.KADER]: "Kader",
  [USER_LEVEL_ENUM.KADER_INVENTRA]: "Kader Inventra",
  [USER_LEVEL_ENUM.KADER_KOMPROF]: "Kader Komprof",
  [USER_LEVEL_ENUM.KADER_LANJUT]: "Kader Lanjut",
} as const;
