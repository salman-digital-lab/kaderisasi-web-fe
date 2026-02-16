"use server";

import { cookies } from "next/headers";

import { LoginResp } from "../../types/api/auth";
import { serverApiConfig } from "../../config/apiConfig";

import fetcher from "../common/fetcher";
import { getErrorMessage } from "../../types/server-action";
import {
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "../../constants";

type LoginFormData = {
  email: string;
  password: string;
};

export default async function login({ email, password }: LoginFormData) {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  (await cookies()).delete(NAME_COOKIE_NAME);
  (await cookies()).delete(PROFILE_PICTURE_COOKIE_NAME);

  const rawFormData = {
    email,
    password,
  };

  try {
    const response = await fetcher<LoginResp>(
      serverApiConfig.beApi + "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(rawFormData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    (await cookies()).set(SESSION_COOKIE_NAME, response?.data?.token?.token, {
      expires: tomorrow,
    });
    (await cookies()).set(NAME_COOKIE_NAME, response?.data?.data?.name, {
      expires: tomorrow,
    });
    (await cookies()).set(
      PROFILE_PICTURE_COOKIE_NAME,
      response?.data?.data?.picture || "",
      {
        expires: tomorrow,
      },
    );

    return { success: true, message: response.message };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Terjadi kesalahan saat login"),
    };
  }
}
