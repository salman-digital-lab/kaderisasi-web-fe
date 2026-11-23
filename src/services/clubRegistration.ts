import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import type { ClubRegistrationStatus } from "../types/model/clubRegistration";

interface ApiResponse<T> {
  message: string;
  data: T;
}

const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getRegistrationStatus = async (
  clubId: number,
  token?: string,
): Promise<ApiResponse<ClubRegistrationStatus>> => {
  const { beApi } = getApiConfig();
  return await fetcher<ApiResponse<ClubRegistrationStatus>>(
    `${beApi}/clubs/${clubId}/registration-status`,
    {
      headers: getAuthHeaders(token),
      cache: "no-store",
    },
  );
};

export const cancelMyRegistration = async (
  clubId: number,
  token?: string,
): Promise<ApiResponse<null>> => {
  const { beApi } = getApiConfig();
  return await fetcher<ApiResponse<null>>(
    `${beApi}/clubs/${clubId}/registration`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    },
  );
};
