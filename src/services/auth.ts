import fetcher from "@/functions/common/fetcher";
import { getApiConfig } from "@/config/apiConfig";

export const postForgotPassword = async (props: { email: string }) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<{ message: string }>(
    beApi + "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify(props),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
};

export const putResetPassword = async (
  token: string,
  props: { password: string },
) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<{ message: string }>(
    beApi + "/auth/reset-password?token=" + token,
    {
      method: "PUT",
      body: JSON.stringify(props),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
};
