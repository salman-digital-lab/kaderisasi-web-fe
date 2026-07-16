import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import type {
  ClubRegistration,
  ClubRegistrationUpdateRequest,
  ClubRegistrationStatus,
} from "../types/model/clubRegistration";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  message: string;
  data: {
    data: T[];
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
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

export const updateMyRegistration = async (
  clubId: number,
  data: ClubRegistrationUpdateRequest,
  token?: string,
): Promise<ApiResponse<ClubRegistration>> => {
  const { beApi } = getApiConfig();
  return await fetcher<ApiResponse<ClubRegistration>>(
    `${beApi}/clubs/${clubId}/registration`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: getAuthHeaders(token),
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

export const getMyClubRegistrations = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  token?: string,
): Promise<PaginatedResponse<ClubRegistration>> => {
  const { beApi } = getApiConfig();
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  return await fetcher<PaginatedResponse<ClubRegistration>>(
    `${beApi}/club-registrations/my-registrations?${params}`,
    {
      headers: getAuthHeaders(token),
    },
  );
};
