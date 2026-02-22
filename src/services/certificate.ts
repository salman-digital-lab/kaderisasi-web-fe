import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import { PostGenerateSingleCertificateResp } from "../types/api/certificate";

// Public — no auth required
export const getCertificate = async (registrationId: number) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<PostGenerateSingleCertificateResp>(
    beApi + "/certificates/" + registrationId,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  return response.data;
};

// Authenticated — verifies ownership, used for download action
export const downloadCertificate = async (
  token: string,
  registrationId: number,
) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<PostGenerateSingleCertificateResp>(
    beApi + "/certificates/" + registrationId + "/download",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );

  return response.data;
};
