import fetcher from "../functions/common/fetcher";
import {
  GetRuangCurhatResp,
  PostRuangCurhatReq,
  PostRuangCurhatResp,
} from "../types/api/ruangcurhat";

export const getRuangCurhat = async (token: string) => {
  const response = await fetcher<GetRuangCurhatResp>(
    process.env.NEXT_PUBLIC_BE_API + "/ruang-curhat",
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

export const postRuangCurhat = async (
  token: string,
  props: PostRuangCurhatReq,
) => {
  const response = await fetcher<PostRuangCurhatResp>(
    process.env.NEXT_PUBLIC_BE_API + "/ruang-curhat",
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
