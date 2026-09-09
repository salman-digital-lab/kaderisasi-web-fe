import { getCountries, getProvinces } from "@/services/profile.cache";
import { getProfile } from "@/services/profile";
import { verifySession } from "@/functions/server/session";
import PageContainer from "@/components/layout/PageContainer";
import { FormSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
import type { ReactElement } from "react";

import OnboardingForm from "@/features/onboarding/OnboardingForm";
import ErrorWrapper from "@/components/layout/Error";
import type { Member, PublicUser } from "@/types/model/members";

export const metadata = {
  title: "Onboarding",
  description:
    "Buat akun atau lanjut tanpa akun sambil melengkapi profil Kaderisasi Salman dengan pengalaman pengisian yang nyaman di ponsel.",
};

export default function Page(): ReactElement {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageContainer size="md">
        <Suspense fallback={<FormSkeleton />}>
          <OnboardingContent />
        </Suspense>
      </PageContainer>
    </main>
  );
}

async function OnboardingContent(): Promise<ReactElement> {
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
      <>
        <OnboardingForm
          provinceData={provinceData}
          countryData={countryData}
          profileData={profileData}
        />
      </>
    );
  } catch {
    return <ErrorWrapper message="Data formulir tidak berhasil dimuat" />;
  }
}
