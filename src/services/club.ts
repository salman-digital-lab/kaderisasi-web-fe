import fetcher from "../functions/common/fetcher";
import { getApiConfig } from "../config/apiConfig";
import {
  GetClubsReq,
  GetClubsResp,
  GetClubReq,
  GetClubResp,
} from "../types/api/club";

export const getClubs = async (props: GetClubsReq) => {
  const { beApi } = getApiConfig();
  const urlSearch = new URLSearchParams(props).toString();

  const response = await fetcher<GetClubsResp>(beApi + "/clubs?" + urlSearch, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  return response.data;
};

export const getClub = async (props: GetClubReq) => {
  const { beApi } = getApiConfig();
  const response = await fetcher<GetClubResp>(beApi + "/clubs/" + props.id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  return response.data;
};
