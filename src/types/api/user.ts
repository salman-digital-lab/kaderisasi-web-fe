import { APIPagiResponse, APIResponse } from "../helper";
import { PublicUser, Member } from "../model/members";
import { Province } from "../model/province";
import { University } from "../model/university";


export type GetProvincesResp = APIResponse<Province[]>;

export type GetUniversitiesResp = APIPagiResponse<University>;

export type GetProfileResp = APIResponse<{
  userData: PublicUser;
  profile: Member;
}>;

export type PutProfileReq = Partial<Member>;

export type PutProfileResp = APIResponse<Member>;
