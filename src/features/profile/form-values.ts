import type { PutProfileReq } from "@/types/api/user";
import type {
  ExtraData,
  Member,
  EducationEntry,
  WorkEntry,
} from "@/types/model/members";
import {
  normalizeEducationHistory,
  normalizeWorkHistory,
} from "@/utils/profile-history";

export type ProfileFormValues = {
  name: string;
  gender: Member["gender"];
  personal_id: string;
  birth_date: string | null;
  province_id: string | null;
  city_id: string | null;
  origin_province_id: string | null;
  origin_city_id: string | null;
  country: string | null;
  whatsapp: string;
  line: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  education_history: EducationEntry[];
  work_history: WorkEntry[];
  extra_data: ExtraData & {
    preferred_name: string;
    current_activity_focus: string[];
  };
};
export function profileFormValues(profile: Member): ProfileFormValues {
  return {
    name: profile.name ?? "",
    gender: profile.gender ?? undefined,
    personal_id: profile.personal_id ?? "",
    birth_date: profile.birth_date?.slice(0, 10) || null,
    province_id: profile.province_id?.toString() ?? null,
    city_id: profile.city_id?.toString() ?? null,
    origin_province_id: profile.origin_province_id?.toString() ?? null,
    origin_city_id: profile.origin_city_id?.toString() ?? null,
    country: profile.country ?? null,
    whatsapp: profile.whatsapp ?? "",
    line: profile.line ?? "",
    linkedin: profile.linkedin ?? "",
    instagram: profile.instagram ?? "",
    tiktok: profile.tiktok ?? "",
    education_history: normalizeEducationHistory(profile.education_history),
    work_history: normalizeWorkHistory(profile.work_history),
    extra_data: {
      ...profile.extra_data,
      preferred_name: profile.extra_data?.preferred_name ?? "",
      current_activity_focus: profile.extra_data?.current_activity_focus ?? [],
    },
  };
}
export function profileFormRequest(values: ProfileFormValues): PutProfileReq {
  return {
    ...values,
    province_id: values.province_id ? Number(values.province_id) : undefined,
    city_id: values.city_id ? Number(values.city_id) : undefined,
    origin_province_id: values.origin_province_id
      ? Number(values.origin_province_id)
      : undefined,
    origin_city_id: values.origin_city_id
      ? Number(values.origin_city_id)
      : undefined,
    country: values.country ?? undefined,
    birth_date: values.birth_date ?? undefined,
    education_history: normalizeEducationHistory(values.education_history),
    work_history: normalizeWorkHistory(values.work_history),
  };
}
