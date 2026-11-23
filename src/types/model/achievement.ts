import {
  type ACHIEVEMENT_STATUS_ENUM,
  type ACHIEVEMENT_TYPE_ENUM,
} from "@/types/constants/achievement";
import { type AdminUser } from "./adminuser";
import { type PublicUser } from "./members";
import { type Member } from "./members";

export type Achievement = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  achievement_date: string;
  type: ACHIEVEMENT_TYPE_ENUM;
  score: number;
  proof: string;
  status: ACHIEVEMENT_STATUS_ENUM;
  remark?: string;
  approver_id: number;
  approved_at: string;
  created_at: string;
  updated_at: string;
  user: PublicUser;
  approver?: AdminUser;
};

export interface MonthlyLeaderboard {
  id: number;
  user_id: number;
  score: number;
  month?: string;
  created_at: string;
  updated_at: string;
  user: PublicUser & { profile: Omit<Member, "publicUser"> };
}
