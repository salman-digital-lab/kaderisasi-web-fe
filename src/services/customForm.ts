import fetcher from "../functions/common/fetcher";
import {
  GetCustomFormByFeatureReq,
  GetCustomFormByFeatureResp,
  PostCustomFormRegistrationReq,
  PostCustomFormRegistrationResp,
} from "../types/api/customForm";

export const getCustomFormByFeature = async (props: GetCustomFormByFeatureReq) => {
  const params: Record<string, string> = {
    feature_type: props.feature_type,
  };
  
  if (props.feature_id !== undefined) {
    params.feature_id = props.feature_id.toString();
  }
  
  const urlSearch = new URLSearchParams(params).toString();

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
