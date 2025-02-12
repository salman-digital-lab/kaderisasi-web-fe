import { APIResponse } from "../helper";
import { LifetimeLeaderboard, MonthlyLeaderboard } from "../model/achievement";
import { Achievement } from "../model/achievement";

export type GetMonthlyLeaderboardResp = APIResponse<MonthlyLeaderboard[]>;

export type GetLifetimeLeaderboardResp = APIResponse<LifetimeLeaderboard[]>;

export type SubmitAchievementReq = {
  name: string;
  description: string;
  achievement_date: string;
  type: string;
  proof: File;
};

export type SubmitAchievementResp = APIResponse<Achievement>;
