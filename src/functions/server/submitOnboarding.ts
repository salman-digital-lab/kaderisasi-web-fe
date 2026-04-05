"use server";

import { cookies } from "next/headers";

import { serverApiConfig } from "@/config/apiConfig";
import fetcher from "@/functions/common/fetcher";
import { putProfile } from "@/services/profile";
import { verifySession } from "@/functions/server/session";
import {
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/constants";
import type { LoginResp, RegisterResp } from "@/types/api/auth";
import type { ServerActionResult } from "@/types/server-action";
import { getErrorMessage } from "@/types/server-action";
import {
  buildAccountProfilePayload,
  buildNoAccountProfilePayload,
  onboardingFormSchema,
  type OnboardingFormValues,
} from "@/features/onboarding/schema";

type SubmitOnboardingResult = {
  mode: OnboardingFormValues["mode"];
  redirectTo?: string;
};

export default async function submitOnboarding(
  rawValues: OnboardingFormValues,
): Promise<ServerActionResult<SubmitOnboardingResult>> {
  const { session } = await verifySession();
  const valuesToValidate =
    rawValues.mode === "login" && session && rawValues.password === ""
      ? {
          ...rawValues,
          password: "__authenticated__",
          confirmPassword: "__authenticated__",
        }
      : rawValues;

  const parsed = onboardingFormSchema.safeParse(valuesToValidate);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message || "Data onboarding tidak valid",
    };
  }

  const values = parsed.data;

  try {
    if (values.mode === "no_account") {
      const payload = buildNoAccountProfilePayload(values);

      await fetcher<{ message: string }>(
        serverApiConfig.beApi + "/members/submit",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        message: "Data berhasil dikirim",
        data: { mode: "no_account" },
      };
    }

    if (values.mode === "login") {
      if (!session) {
        return {
          success: false,
          message: "Silakan login terlebih dahulu untuk melanjutkan",
        };
      }

      const profileResponse = await putProfile(
        session,
        buildAccountProfilePayload(values),
      );

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      (await cookies()).set(
        NAME_COOKIE_NAME,
        profileResponse.data?.name || values.name,
        {
          expires: tomorrow,
        },
      );

      return {
        success: true,
        message: "Profil berhasil diperbarui",
        data: {
          mode: "login",
          redirectTo: "/profile",
        },
      };
    }

    await fetcher<RegisterResp>(serverApiConfig.beApi + "/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullname: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginResponse = await fetcher<LoginResp>(
      serverApiConfig.beApi + "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const token = loginResponse.data.token.token;
    const profileResponse = await putProfile(
      token,
      buildAccountProfilePayload(values),
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      expires: tomorrow,
    });
    (await cookies()).set(
      NAME_COOKIE_NAME,
      profileResponse.data?.name || values.name,
      {
        expires: tomorrow,
      },
    );
    (await cookies()).set(
      PROFILE_PICTURE_COOKIE_NAME,
      profileResponse.data?.picture || "",
      {
        expires: tomorrow,
      },
    );

    return {
      success: true,
      message: "Akun dan profil berhasil dibuat",
      data: {
        mode: "account",
        redirectTo: "/profile",
      },
    };
  } catch (error: unknown) {
    const message = getErrorMessage(
      error,
      "Terjadi kesalahan saat menyimpan data onboarding",
    );

    if (values.mode === "account" && message === "EMAIL_ALREADY_REGISTERED") {
      return {
        success: false,
        message:
          "Email ini sudah terdaftar. Silakan login terlebih dahulu untuk melanjutkan onboarding.",
      };
    }

    return {
      success: false,
      message,
    };
  }
}
