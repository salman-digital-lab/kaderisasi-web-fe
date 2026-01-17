import fetcher from "@/functions/common/fetcher";
import { getApiConfig } from "@/config/apiConfig";
import {
  GetMonthlyLeaderboardResp,
  GetLifetimeLeaderboardResp,
  SubmitAchievementReq,
  SubmitAchievementResp,
  GetMyAchievementsResp,
} from "@/types/api/leaderboard";

export const getMonthlyLeaderboard = async (
  page: number = 1,
  perPage: number = 10,
  month: string,
) => {
  const { beApi } = getApiConfig();
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    month,
  });

  const response = await fetcher<GetMonthlyLeaderboardResp>(
    beApi + `/achievements/monthly?${params.toString()}`,
    {
      next: { revalidate: 60 },
    },
  );

  return response;
};

export const getLifetimeLeaderboard = async (
  page: number = 1,
  perPage: number = 10,
) => {
  const { beApi } = getApiConfig();
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetcher<GetLifetimeLeaderboardResp>(
    beApi + `/achievements/lifetime?${params.toString()}`,
    {
      next: { revalidate: 60 },
    },
  );

  return response;
};

export const submitAchievement = async (
  payload: SubmitAchievementReq,
  token: string,
) => {
  const { beApi } = getApiConfig();
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("achievement_date", payload.achievement_date);
  formData.append("type", payload.type);
  formData.append("proof", payload.proof);

  return await fetcher<SubmitAchievementResp>(`${beApi}/achievements`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const editAchievement = async (
  id: number,
  payload: Omit<SubmitAchievementReq, "proof"> & { proof?: File },
  token: string,
) => {
  const { beApi } = getApiConfig();
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("achievement_date", payload.achievement_date);
  formData.append("type", payload.type);
  if (payload.proof) {
    formData.append("proof", payload.proof);
  }

  return await fetcher<SubmitAchievementResp>(`${beApi}/achievements/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const getMyLifetimeRank = async (token: string) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<{
    message: string;
    data: {
      rank: number | null;
      score: number;
      message?: string;
    };
  }>(beApi + `/achievements/my-rank`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  return response;
};

export const getMyAchievements = async (
  token: string,
  page: number = 1,
  perPage: number = 100,
) => {
  const { beApi } = getApiConfig();
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetcher<GetMyAchievementsResp>(
    beApi + `/achievements?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      revalidate: 60, // Cache for 1 minute since it's personal data
      tags: ["achievements", "personal"],
    },
  );

  return response.data.data;
};
