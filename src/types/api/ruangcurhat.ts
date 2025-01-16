import { APIResponse } from "../helper";
import { RuangCurhatData } from "../model/ruangcurhat";

export type PostRuangCurhatReq = Partial<RuangCurhatData>;

export type PostRuangCurhatResp = APIResponse<RuangCurhatData>;

export type GetRuangCurhatResp = APIResponse<RuangCurhatData[]>;
