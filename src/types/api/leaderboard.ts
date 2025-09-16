import { APIPagiResponse, APIResponse } from "../helper";
import { LifetimeLeaderboard, MonthlyLeaderboard } from "../model/achievement";
import { Achievement } from "../model/achievement";

export type GetMonthlyLeaderboardResp = APIPagiResponse<MonthlyLeaderboard>;

export type GetLifetimeLeaderboardResp = APIPagiResponse<LifetimeLeaderboard>;

export type SubmitAchievementReq = {
  name: string;
  description: string;
  achievement_date: string;
  type: string;
  proof: File;
};

export type SubmitAchievementResp = APIResponse<Achievement>;

export type GetMyAchievementsResp = APIPagiResponse<Achievement>;
