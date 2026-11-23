import { type APIPagiResponse, type APIResponse } from "../helper";
import { type PublicUser, type Member } from "../model/members";
import { type Province } from "../model/province";
import { type University } from "../model/university";

export type GetProvincesResp = APIResponse<Province[]>;

export type GetUniversitiesResp = APIPagiResponse<University>;

export type GetProfileResp = APIResponse<{
  userData: PublicUser;
  profile: Member;
}>;

export type PutProfileReq = Partial<Member>;

export type PutProfileResp = APIResponse<Member>;
