import { getCountries, getProvinces } from "@/services/profile.cache";
import { getProfile } from "@/services/profile";
import { verifySession } from "@/functions/server/session";
import { Container } from "@mantine/core";

import OnboardingForm from "@/features/onboarding/OnboardingForm";
import ErrorWrapper from "@/components/layout/Error";
import type { Member, PublicUser } from "@/types/model/members";

export const metadata = {
  title: "Onboarding",
  description:
    "Buat akun atau lanjut tanpa akun sambil melengkapi profil Kaderisasi Salman dengan pengalaman pengisian yang nyaman di ponsel.",
};

export default async function Page() {
  try {
    const sessionData = await verifySession();
    const [provinceData, countryData] = await Promise.all([
      getProvinces(),
      getCountries(),
    ]);
    let profileData:
      | {
          userData: PublicUser;
          profile: Member;
        }
      | undefined;

    if (sessionData.session) {
      try {
        profileData = await getProfile(sessionData.session);
      } catch {
        profileData = undefined;
      }
    }

    return (
      <Container size="lg" component="main" px={{ base: 8, sm: "sm" }}>
        <OnboardingForm
          provinceData={provinceData}
          countryData={countryData}
          profileData={profileData}
        />
      </Container>
    );
  } catch {
    return <ErrorWrapper message="Data formulir tidak berhasil dimuat" />;
  }
}
