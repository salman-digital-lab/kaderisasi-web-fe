import fetcher from "../functions/common/fetcher";
import { cleanEmptyKeyFromObject } from "../functions/common/helper";
import {
  GetProfileResp,
  GetProvincesResp,
  GetUniversitiesResp,
  PutProfileReq,
  PutProfileResp,
} from "../types/api/user";

export const getProvinces = async () => {
  const response = await fetcher<GetProvincesResp>(
    process.env.NEXT_PUBLIC_BE_ADMIN_API + "/provinces",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      revalidate: 86400, // Cache for 24 hours since provinces rarely change
      tags: ["provinces"],
    },
  );

  return response.data;
};

export const getUniversities = async (search?: string) => {
  const response = await fetcher<GetUniversitiesResp>(
    process.env.NEXT_PUBLIC_BE_ADMIN_API +
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
  const response = await fetcher<GetProfileResp>(
    process.env.NEXT_PUBLIC_BE_API + "/profiles",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      cache: "no-store",
    },
  );

  return response.data;
};

export const putProfile = async (token: string, data: PutProfileReq) => {
  const finalData = cleanEmptyKeyFromObject(data);
  const response = await fetcher<PutProfileResp>(
    process.env.NEXT_PUBLIC_BE_API + "/profiles",
    {
      method: "PUT",
      body: JSON.stringify(finalData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );

  return response;
};

export const postProfilePicture = async (token: string, picture: File) => {
  const formData = new FormData();
  formData.append("file", picture);

  const response = await fetcher<{
    message: string;
    data: { picture: string };
  }>(process.env.NEXT_PUBLIC_BE_API + "/profiles/picture", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return response;
};
