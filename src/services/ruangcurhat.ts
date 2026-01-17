import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import {
  GetRuangCurhatResp,
  PostRuangCurhatReq,
  PostRuangCurhatResp,
} from "../types/api/ruangcurhat";

export const getRuangCurhat = async (token: string) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetRuangCurhatResp>(beApi + "/ruang-curhat", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    cache: "no-store",
  });

  return response.data;
};

export const postRuangCurhat = async (
  token: string,
  props: PostRuangCurhatReq,
) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<PostRuangCurhatResp>(beApi + "/ruang-curhat", {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  return response;
};
