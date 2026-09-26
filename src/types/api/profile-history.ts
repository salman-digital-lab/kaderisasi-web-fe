import type { Achievement } from "@/types/model/achievement";
import type { RuangCurhatData } from "@/types/model/ruangcurhat";
import type { Registrant } from "@/types/model/activity";

export type HistoryPage<T, S> = {
  items: T[];
  meta: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
  summary: S;
};
export type ActivityHistoryItem = Pick<
  Registrant,
  "id" | "activity_id" | "status" | "certificate_state" | "certificate_code"
> & {
  visible_at: string | null;
  created_at: string | null;
  activity_name: string;
  activity_slug: string;
  image_url: string | null;
  has_certificate: boolean;
};
export type ActivityHistorySummary = {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
};
export type ConsultationHistoryItem = Pick<
  RuangCurhatData,
  | "id"
  | "problem_ownership"
  | "problem_category"
  | "problem_description"
  | "handling_technic"
  | "status"
  | "created_at"
> & {
  owner_name: string | null;
  adminUser: { display_name: string | null; email: string } | null;
};
export type AchievementHistoryItem = Pick<
  Achievement,
  | "id"
  | "name"
  | "description"
  | "achievement_date"
  | "type"
  | "score"
  | "proof"
  | "status"
> & { remark: string | null };
export type ProfileHistories = {
  activities: HistoryPage<ActivityHistoryItem, ActivityHistorySummary>;
  consultations: HistoryPage<ConsultationHistoryItem, { total: number }>;
  achievements: HistoryPage<
    AchievementHistoryItem,
    { total: number; points: number }
  >;
};
export type HistorySection = keyof ProfileHistories;
