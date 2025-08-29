import fetcher from "../functions/common/fetcher";
import {
  GetCustomFormByFeatureReq,
  GetCustomFormByFeatureResp,
  PostCustomFormRegistrationReq,
  PostCustomFormRegistrationResp,
} from "../types/api/customForm";

export const getCustomFormByFeature = async (props: GetCustomFormByFeatureReq) => {
  const urlSearch = new URLSearchParams({
    feature_type: props.feature_type,
    feature_id: props.feature_id.toString(),
  }).toString();

  const response = await fetcher<GetCustomFormByFeatureResp>(
    process.env.NEXT_PUBLIC_BE_API + "/custom-forms/by-feature?" + urlSearch,
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

export const registerWithCustomForm = async (
  token: string,
  props: PostCustomFormRegistrationReq,
) => {
  const response = await fetcher<PostCustomFormRegistrationResp>(
    process.env.NEXT_PUBLIC_BE_API + "/custom-forms/register",
    {
      method: "POST",
      body: JSON.stringify(props),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );

  return response;
};
