import fetcher from "@/functions/common/fetcher";
import { getApiConfig } from "@/config/apiConfig";

type SubmitPublicMemberProfilePayload = {
  name: string;
  gender?: "M" | "F";
  personal_id?: string;
  whatsapp: string;
  line?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  birth_date?: string;
  province_id?: number;
  city_id?: number;
  origin_province_id?: number;
  origin_city_id?: number;
  country?: string;
  education_history: {
    degree: "bachelor" | "master" | "doctoral";
    institution: string;
    major: string;
    intake_year: number;
  }[];
  work_history: {
    job_title: string;
    company: string;
    start_year?: number;
    end_year?: number;
  }[];
  extra_data?: {
    preferred_name?: string;
    salman_activity_history?: string[];
    current_activity_focus?: string[];
  };
};

export async function submitPublicMemberProfile(
  payload: SubmitPublicMemberProfilePayload,
) {
  const { beApi } = getApiConfig();

  return fetcher<{ message: string }>(beApi + "/members/submit", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
