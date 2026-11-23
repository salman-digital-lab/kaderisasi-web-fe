import { type APIResponse } from "../helper";
import { type Member, type PublicUser, type Token } from "../model/members";

export type LoginResp = APIResponse<{
  user: PublicUser;
  data: Member;
  token: Token;
}>;

export type RegisterResp = APIResponse<Member>;
