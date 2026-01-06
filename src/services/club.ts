import fetcher from "../functions/common/fetcher";
import {
  GetClubsReq,
  GetClubsResp,
  GetClubReq,
  GetClubResp,
} from "../types/api/club";

export const getClubs = async (props: GetClubsReq) => {
  const urlSearch = new URLSearchParams(props).toString();

  const response = await fetcher<GetClubsResp>(
    process.env.NEXT_PUBLIC_BE_API + "/clubs?" + urlSearch,
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

export const getClub = async (props: GetClubReq) => {
  const response = await fetcher<GetClubResp>(
    process.env.NEXT_PUBLIC_BE_API + "/clubs/" + props.id,
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
