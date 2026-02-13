import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import { cleanEmptyKeyFromObject } from "../functions/common/helper";
import {
  GetProfileResp,
  GetProvincesResp,
  GetUniversitiesResp,
  PutProfileReq,
  PutProfileResp,
} from "../types/api/user";

export const getProvinces = async () => {
  const { beAdminApi } = getApiConfig();
  const response = await fetcher<GetProvincesResp>(beAdminApi + "/provinces", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getUniversities = async (search?: string) => {
  const { beAdminApi } = getApiConfig();
  const response = await fetcher<GetUniversitiesResp>(
    beAdminApi +
      "/universities?per_page=20" +
      (search ? "&search=" + search : ""),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  return response.data.data;
};

export const getProfile = async (token: string) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetProfileResp>(beApi + "/profiles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    cache: "no-store",
  });

  return response.data;
};

export const putProfile = async (token: string, data: PutProfileReq) => {
  const { beApi } = getApiConfig();
  const finalData = cleanEmptyKeyFromObject(data);
  const response = await fetcher<PutProfileResp>(beApi + "/profiles", {
    method: "PUT",
    body: JSON.stringify(finalData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  return response;
};

export const postProfilePicture = async (token: string, picture: File) => {
  const { beApi } = getApiConfig();
  const formData = new FormData();
  formData.append("file", picture);

  const response = await fetcher<{
    message: string;
    data: { picture: string };
  }>(beApi + "/profiles/picture", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return response;
};
