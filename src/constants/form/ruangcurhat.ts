import { PROBLEM_OWNER_ENUM } from "@/types/constants/ruangcurhat";

export const PROBLEM_OWNER_OPTIONS = [
  { value: String(PROBLEM_OWNER_ENUM.DIRI_SENDIRI), label: "Diri Sendiri" },
  { value: String(PROBLEM_OWNER_ENUM.TEMAN), label: "Teman" },
] as const;
