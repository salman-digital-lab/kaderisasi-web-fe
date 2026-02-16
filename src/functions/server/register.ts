"use server";

import { RegisterResp } from "../../types/api/auth";
import { serverApiConfig } from "../../config/apiConfig";
import fetcher from "../common/fetcher";
import { getErrorMessage } from "../../types/server-action";

type RegisterFormData = {
  fullname: string;
  email: string;
  password: string;
};

export default async function register({
  fullname,
  email,
  password,
}: RegisterFormData) {
  const rawFormData = {
    fullname,
    email,
    password,
  };

  try {
    const response = await fetcher<RegisterResp>(
      serverApiConfig.beApi + "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(rawFormData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return { success: true, message: response.message };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Terjadi kesalahan saat registrasi"),
    };
  }
}
