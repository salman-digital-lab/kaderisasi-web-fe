import fetcher from "@/functions/common/fetcher";
import {
  GetMonthlyLeaderboardResp,
  GetLifetimeLeaderboardResp,
  SubmitAchievementReq,
  SubmitAchievementResp,
} from "@/types/api/leaderboard";

export interface LeaderboardEntry {
  id: number;
  user_id: number;
  score: number;
  month?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    profile: {
      id: number;
      name: string;
      picture: string;
      level: number;
    };
  };
}

export interface LeaderboardResponse {
  message: string;
  data: {
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      first_page: number;
      first_page_url: string;
      last_page_url: string;
      next_page_url: string | null;
      previous_page_url: string | null;
    };
    data: LeaderboardEntry[];
  };
}

export const getMonthlyLeaderboard = async (
  page: number = 1,
  perPage: number = 10,
  month?: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...(month && { month }),
  });

  const response = await fetcher<GetMonthlyLeaderboardResp>(
    process.env.NEXT_PUBLIC_BE_API +
      `/achievements/monthly?${params.toString()}`,
  );

  return response;
};

export const getLifetimeLeaderboard = async (
  page: number = 1,
  perPage: number = 10,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetcher<GetLifetimeLeaderboardResp>(
    process.env.NEXT_PUBLIC_BE_API +
      `/v2/achievements/lifetime?${params.toString()}`,
  );

  return response;
};

export const submitAchievement = async (
  payload: SubmitAchievementReq,
  token: string,
) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("achievement_date", payload.achievement_date);
  formData.append("type", payload.type);
  formData.append("proof", payload.proof);

  return await fetcher<SubmitAchievementResp>(
    `${process.env.NEXT_PUBLIC_BE_API}/achievements`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );
};
