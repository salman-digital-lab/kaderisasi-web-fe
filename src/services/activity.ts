import fetcher from "../functions/common/fetcher";
import {
  GetActivitiesRegistrationResp,
  GetActivitiesReq,
  GetActivitiesResp,
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
  const urlSearch = new URLSearchParams(props).toString();

  const response = await fetcher<GetActivitiesResp>(
    process.env.NEXT_PUBLIC_BE_API + "/activities?" + urlSearch,
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

export const getActivity = async (props: GetActivityReq) => {
  const response = await fetcher<GetActivityResp>(
    process.env.NEXT_PUBLIC_BE_API + "/activities/" + props.slug,
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

export const getActivityRegistration = async (
  token: string,
  props: GetActivityRegistrationReq,
) => {
  const response = await fetcher<GetActivityRegistrationResp>(
    process.env.NEXT_PUBLIC_BE_API + "/profiles/activities/" + props.slug,
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
  const response = await fetcher<GetActivitiesRegistrationResp>(
    process.env.NEXT_PUBLIC_BE_API + "/profiles/activities",
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
  const response = await fetcher<PostActivityResp>(
    process.env.NEXT_PUBLIC_BE_API + "/activities/" + props.slug + "/register",
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
  const response = await fetcher<PutActivityResp>(
    process.env.NEXT_PUBLIC_BE_API +
      "/activities/" +
      props.slug +
      "/registration",
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
