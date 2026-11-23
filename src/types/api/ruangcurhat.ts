import { type APIResponse } from "../helper";
import { type RuangCurhatData } from "../model/ruangcurhat";

export type PostRuangCurhatReq = Partial<RuangCurhatData>;

export type PostRuangCurhatResp = APIResponse<RuangCurhatData>;

export type GetRuangCurhatResp = APIResponse<RuangCurhatData[]>;
