import { ACHIEVEMENT_TYPE_ENUM } from "@/types/constants/achievement";

export const ACHIEVEMENT_TYPE_OPTIONS = [
  { value: String(ACHIEVEMENT_TYPE_ENUM.KOMPETISI), label: "Kompetisi" },
  { value: String(ACHIEVEMENT_TYPE_ENUM.ORGANISASI), label: "Organisasi" },
  { value: String(ACHIEVEMENT_TYPE_ENUM.AKADEMIK), label: "Akademik" },
] as const;
