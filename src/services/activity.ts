import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import {
  GetActivitiesRegistrationResp,
  GetActivitiesReq,
  GetActivitiesResp,
  GetActivityRegistrationDataReq,
  GetActivityRegistrationDataResp,
  GetActivityRegistrationReq,
  GetActivityRegistrationResp,
  GetActivityReq,
  GetActivityResp,
  PostActivityReq,
  PostActivityResp,
  PutActivityReq,
  PutActivityResp,
} from "../types/api/activity";

export const getActivities = async (props: GetActivitiesReq) => {
  const { beApi } = getApiConfig();
  const urlSearch = new URLSearchParams(props).toString();

  const response = await fetcher<GetActivitiesResp>(
    beApi + "/activities?" + urlSearch,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    },
  );

  return response.data;
};

export const getActivity = async (props: GetActivityReq) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetActivityResp>(
    beApi + "/activities/" + props.slug,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    },
  );

  return response.data;
};

export const getActivityRegistration = async (
  token: string,
  props: GetActivityRegistrationReq,
) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetActivityRegistrationResp>(
    beApi + "/profiles/activities/" + props.slug,
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

export const getActivityRegistrationData = async (
  token: string,
  props: GetActivityRegistrationDataReq,
) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetActivityRegistrationDataResp>(
    beApi + "/activities/" + props.slug + "/registration",
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

export const getActivitiesRegistration = async (token: string) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetActivitiesRegistrationResp>(
    beApi + "/profiles/activities",
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

export const postActivity = async (token: string, props: PostActivityReq) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<PostActivityResp>(
    beApi + "/activities/" + props.slug + "/register",
    {
      method: "POST",
      body: JSON.stringify(props.data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );

  return response;
};

export const putActivity = async (token: string, props: PutActivityReq) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<PutActivityResp>(
    beApi + "/activities/" + props.slug + "/registration",
    {
      method: "PUT",
      body: JSON.stringify(props.data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );

  return response;
};
