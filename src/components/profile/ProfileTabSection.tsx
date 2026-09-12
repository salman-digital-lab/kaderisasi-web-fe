import type { ReactElement } from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/services/profile";
import { getProvinces, getCountries } from "@/services/profile.cache";
import { verifySession } from "@/functions/server/session";
import { getActivitiesRegistration } from "@/services/activity";
import { ProfileTab } from "@/features/profile/ProfileTab";
import { getRuangCurhat } from "@/services/ruangcurhat";
import { getMyAchievements } from "@/services/leaderboard";
import { FetcherError } from "@/functions/common/fetcher";
import type { ProfileSection } from "@/features/profile/types";

async function loadSection<T>(
  request: Promise<T | undefined>,
  label: string,
): Promise<ProfileSection<T>> {
  let data: T | undefined;
  try {
    data = await request;
  } catch (error: unknown) {
    if (error instanceof FetcherError && error.status === 401)
      redirect("/api/logout");
    return { error: `${label} belum dapat dimuat. Silakan coba lagi.` };
  }
  return data === undefined
    ? { error: `${label} belum dapat dimuat. Silakan coba lagi.` }
    : { data };
}

export default async function ProfileTabSection(): Promise<ReactElement> {
  const { session } = await verifySession();
  if (!session) redirect("/login");
  const [
    profile,
    provinces,
    countries,
    activities,
    consultations,
    achievements,
  ] = await Promise.all([
    loadSection(getProfile(session), "Data diri"),
    loadSection(getProvinces(), "Daftar provinsi"),
    loadSection(getCountries(), "Daftar negara"),
    loadSection(getActivitiesRegistration(session), "Kegiatan"),
    loadSection(getRuangCurhat(session), "Sesi Ruang Curhat"),
    loadSection(getMyAchievements(session), "Prestasi"),
  ]);
  return (
    <ProfileTab
      sections={{
        profile,
        provinces,
        countries,
        activities,
        consultations,
        achievements,
      }}
      token={session}
    />
  );
}
