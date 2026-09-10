import type { APIPagiResponse, APIResponse } from "../helper";
import type { Activity, Registrant } from "../model/activity";
import type { CertificateLifecycleState } from "../model/certificate";

export type GetActivitiesReq = {
  per_page?: string;
  page?: string;
  search?: string;
  club_id?: string;
};

export type GetActivitiesResp = APIPagiResponse<Activity>;

export type GetActivityReq = {
  slug: string;
};

export type GetActivityResp = APIResponse<Activity>;

export type GetActivityRegistrationReq = {
  slug: string;
};

export type GetActivityRegistrationResp = APIResponse<{
  status: string;
  visible_at?: string;
  registration_id?: number;
  certificate_code?: string | null;
  certificate_state?: CertificateLifecycleState;
}>;

export type GetActivityRegistrationDataReq = {
  slug: string;
};

export type GetActivityRegistrationDataResp = APIResponse<Registrant>;

export type GetActivitiesRegistrationResp = APIResponse<
  ({ activity: Activity } & Registrant)[]
>;

export type GetActivityCategoriesResp = APIResponse<number[]>;

export type PutActivityReq = {
  slug: string;
  data: { questionnaire_answer: Record<string, string> };
};

export type PutActivityResp = APIResponse<Registrant>;

export type PostGuestActivityReq = {
  slug: string;
  data: {
    guest_data: Record<string, unknown>;
    questionnaire_answer: Record<string, unknown>;
  };
};

export type PostGuestActivityResp = APIResponse<Registrant>;
