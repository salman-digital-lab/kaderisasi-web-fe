import { APIResponse } from "../helper";

export type EmailChangeStep = {
  /** "code": enter the code sent to the current email; "link": open the link sent to the new email. */
  step: "code" | "link";
  /** The requested new email. */
  email: string;
  expires_at: string;
};

export type EmailChangeStatus = {
  password_required: boolean;
  pending: EmailChangeStep | null;
};

export type EmailChangeStatusResp = APIResponse<EmailChangeStatus>;
export type EmailChangeStepResp = APIResponse<EmailChangeStep>;
