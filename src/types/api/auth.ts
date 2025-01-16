import { APIResponse } from "../helper";
import { Member, PublicUser, Token } from "../model/members";

export type LoginResp = APIResponse<{
  user: PublicUser;
  data: Member;
  token: Token;
}>;

export type RegisterResp = APIResponse<Member>;
