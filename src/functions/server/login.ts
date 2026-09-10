"use server";

import { setLoginSession } from "../auth/setLoginSession";

import { serverApiConfig } from "../../config/apiConfig";
import type { LoginResp } from "../../types/api/auth";

import fetcher from "../common/fetcher";
import { getErrorMessage } from "../../types/server-action";

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

    if (!(await setLoginSession(response))) {
      return {
        success: false,
        message: "LOGIN_TOKEN_NOT_FOUND",
      };
    }

    return { success: true, message: response.message };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Terjadi kesalahan saat login"),
    };
  }
}
