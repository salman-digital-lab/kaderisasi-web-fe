import { APIResponse, APIPagiResponse } from "../helper";
import { Club } from "../model/club";

export type GetClubsReq = {
  page?: string;
  per_page?: string;
  search?: string;
};

export type GetClubsResp = APIPagiResponse<Club>;

export type GetClubReq = {
  id: string;
};

export type GetClubResp = APIResponse<Club>;
