import { APIResponse, APIPagiResponse } from "../helper";
import type { Club, ClubDetail, ClubType } from "../model/club";

export type GetClubsReq = {
  page?: string;
  per_page?: string;
  search?: string;
  club_type?: ClubType;
};

export type GetClubsResp = APIPagiResponse<Club>;

export type GetClubReq = {
  id: string;
};

export type GetClubResp = APIResponse<ClubDetail>;
