import type { Country } from "@/types/model/country";
import type { Member, PublicUser } from "@/types/model/members";
import type { Province } from "@/types/model/province";

export const PROFILE_TABS = {
  profiledata: "Data Diri",
  activity: "Kegiatan",
  ruangcurhat: "Ruang Curhat",
  achievements: "Prestasi",
} as const;
export type ProfileTabId = keyof typeof PROFILE_TABS;
export type ProfileData = { userData: PublicUser; profile: Member };
export type ProfileSection<T> =
  { data: T; error?: never } | { data?: never; error: string };
export type ProfileSections = {
  profile: ProfileSection<ProfileData>;
  provinces: ProfileSection<Province[]>;
  countries: ProfileSection<Country[]>;
};
export function profileTabId(value: string | null): ProfileTabId {
  return value && Object.hasOwn(PROFILE_TABS, value)
    ? (value as ProfileTabId)
    : "profiledata";
}
