import {
  ACHIEVEMENT_STATUS_ENUM,
  ACHIEVEMENT_TYPE_ENUM,
} from "@/types/constants/achievement";
import { AdminUser } from "./adminuser";
import { PublicUser } from "./members";
import { Member } from "./members";

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

export interface LifetimeLeaderboard {
  id: number;
  user_id: number;
  score: number;
  created_at: string;
  updated_at: string;
  user: PublicUser & { profile: Omit<Member, "publicUser"> };
}
