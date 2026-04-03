import { getProfile } from "@/services/profile";
import { getProvinces, getCountries } from "@/services/profile.cache";
import { verifySession } from "@/functions/server/session";
import { getActivitiesRegistration } from "@/services/activity";
import { ProfileTab } from "@/features/profile/ProfileTab";
import { getRuangCurhat } from "@/services/ruangcurhat";
import { getMyAchievements } from "@/services/leaderboard";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";

export async function ProfileTabSection() {
  const sessionData = await verifySession();

  try {
    const [provinceData, countryData, profileData, activitiesRegistration, ruangCurhatData, achievements] =
      await Promise.all([
        getProvinces(),
        getCountries(),
        getProfile(sessionData.session || ""),
        getActivitiesRegistration(sessionData.session || ""),
        getRuangCurhat(sessionData.session || ""),
        getMyAchievements(sessionData.session || ""),
      ]);

    return (
      <ProfileTab
        profileData={profileData}
        provinceData={provinceData}
        countryData={countryData}
        activitiesRegistration={activitiesRegistration}
        ruangcurhatData={ruangCurhatData}
        achievements={achievements}
        token={sessionData.session || ""}
      />
    );
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
    return <ErrorWrapper message="Terjadi kesalahan" />;
  }
}

export default ProfileTabSection;
