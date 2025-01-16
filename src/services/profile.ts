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
      cache: "no-store",
    },
  );

  return response.data;
};

export const getUniversities = async () => {
  const response = await fetcher<GetUniversitiesResp>(
    process.env.NEXT_PUBLIC_BE_ADMIN_API + "/universities?per_page=5000",
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
