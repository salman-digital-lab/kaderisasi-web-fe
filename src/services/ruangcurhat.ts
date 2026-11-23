import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import {
  type PostRuangCurhatReq,
  type PostRuangCurhatResp,
} from "../types/api/ruangcurhat";

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
