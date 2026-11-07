import fetcher from "@/functions/common/fetcher";
import { getApiConfig } from "@/config/apiConfig";
import type { APIResponse } from "@/types/helper";
import type { LoginResp } from "@/types/api/auth";
import type {
  EmailChangeStatusResp,
  EmailChangeStepResp,
} from "@/types/api/email-change";

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + token,
});

export const getEmailChange = async (token: string) => {
  const { beApi } = getApiConfig();
  return fetcher<EmailChangeStatusResp>(beApi + "/profiles/email-change", {
    headers: headers(token),
    cache: "no-store",
  });
};

export const postEmailChange = async (
  token: string,
  body: { email: string; password?: string },
) => {
  const { beApi } = getApiConfig();
  return fetcher<EmailChangeStepResp>(beApi + "/profiles/email-change", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers(token),
  });
};

export const postEmailChangeCode = async (token: string, code: string) => {
  const { beApi } = getApiConfig();
  return fetcher<EmailChangeStepResp>(
    beApi + "/profiles/email-change/verify-code",
    { method: "POST", body: JSON.stringify({ code }), headers: headers(token) },
  );
};

export const deleteEmailChange = async (token: string) => {
  const { beApi } = getApiConfig();
  return fetcher<APIResponse<undefined>>(beApi + "/profiles/email-change", {
    method: "DELETE",
    headers: headers(token),
  });
};

export const putConfirmEmailChange = async (confirmToken: string) => {
  const { beApi } = getApiConfig();
  return fetcher<LoginResp>(
    beApi +
      "/auth/confirm-email-change?token=" +
      encodeURIComponent(confirmToken),
    { method: "PUT", headers: { "Content-Type": "application/json" } },
  );
};
