"use server";

import { serverApiConfig } from "@/config/apiConfig";
import fetcher from "@/functions/common/fetcher";
import type { ServerActionResult } from "@/types/server-action";
import { getErrorMessage } from "@/types/server-action";

type CheckEmailResponse = {
  message: string;
  data?: {
    exists: boolean;
  };
};

export default async function checkOnboardingEmail(
  email: string,
): Promise<ServerActionResult<{ exists: boolean }>> {
  try {
    const response = await fetcher<CheckEmailResponse>(
      serverApiConfig.beApi + "/auth/check-email",
      {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      message: response.message,
      data: {
        exists: response.data?.exists ?? false,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Terjadi kesalahan saat memeriksa email akun",
      ),
    };
  }
}
