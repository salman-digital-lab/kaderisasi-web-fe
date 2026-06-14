"use server";

import { cookies } from "next/headers";

import { serverApiConfig } from "../../config/apiConfig";
import type { LoginResp } from "../../types/api/auth";

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

    const token = response.data?.token?.token;

    if (!token) {
      return {
        success: false,
        message: "LOGIN_TOKEN_NOT_FOUND",
      };
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(NAME_COOKIE_NAME);
    cookieStore.delete(PROFILE_PICTURE_COOKIE_NAME);

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      expires: tomorrow,
    });
    cookieStore.set(NAME_COOKIE_NAME, response.data?.data?.name || "", {
      expires: tomorrow,
    });
    cookieStore.set(
      PROFILE_PICTURE_COOKIE_NAME,
      response.data?.data?.picture || "",
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
