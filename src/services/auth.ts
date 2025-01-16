import fetcher from "@/functions/common/fetcher";

export const postForgotPassword = async (props: { email: string }) => {
  const response = await fetcher<{ message: string }>(
    process.env.NEXT_PUBLIC_BE_API + "/auth/forgot-password",
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
  const response = await fetcher<{ message: string }>(
    process.env.NEXT_PUBLIC_BE_API + "/auth/reset-password?token=" + token,
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
