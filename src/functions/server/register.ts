"use server";

import { RegisterResp } from "../../types/api/auth";
import fetcher from "../common/fetcher";
import { handleCatchError } from "../common/handler";

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
      process.env.NEXT_PUBLIC_BE_API + "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(rawFormData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.message;
  } catch (error: unknown) {
    handleCatchError(error);
  }
}
