import { type APIPagiResponse, type APIResponse } from "../helper";
import { type MonthlyLeaderboard } from "../model/achievement";
import { type Achievement } from "../model/achievement";

export type GetMonthlyLeaderboardResp = APIPagiResponse<MonthlyLeaderboard>;

export type SubmitAchievementReq = {
  name: string;
  description: string;
  achievement_date: string;
  type: string;
  proof: File;
};

export type SubmitAchievementResp = APIResponse<Achievement>;
