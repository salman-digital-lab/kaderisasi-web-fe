import fetcher from "../functions/common/fetcher";
import {
  ClubRegistration,
  ClubRegistrationRequest,
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

const BASE_URL = process.env.NEXT_PUBLIC_BE_API;

// Helper function to get auth headers with token from cookie (client-side)
const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // For client-side, try to get token from cookie if not provided
  if (typeof window !== "undefined" && !token) {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="));

    if (sessionCookie) {
      token = sessionCookie.split("=")[1];
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Club registration endpoints for public users
export const registerToClub = async (
  clubId: number,
  data: ClubRegistrationRequest = {},
  token?: string,
): Promise<ApiResponse<ClubRegistration>> => {
  return await fetcher<ApiResponse<ClubRegistration>>(
    `${BASE_URL}/clubs/${clubId}/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: getAuthHeaders(token),
    },
  );
};

export const getRegistrationStatus = async (
  clubId: number,
  token?: string,
): Promise<ApiResponse<ClubRegistrationStatus>> => {
  return await fetcher<ApiResponse<ClubRegistrationStatus>>(
    `${BASE_URL}/clubs/${clubId}/registration-status`,
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
  return await fetcher<ApiResponse<ClubRegistration>>(
    `${BASE_URL}/clubs/${clubId}/registration`,
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
): Promise<ApiResponse<ClubRegistration>> => {
  return await fetcher<ApiResponse<ClubRegistration>>(
    `${BASE_URL}/clubs/${clubId}/registration`,
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
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  return await fetcher<PaginatedResponse<ClubRegistration>>(
    `${BASE_URL}/club-registrations/my-registrations?${params}`,
    {
      headers: getAuthHeaders(token),
    },
  );
};
