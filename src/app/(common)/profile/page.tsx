import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Suspense } from "react";
import ProfileTabSection from "@/components/profile/ProfileTabSection";
import { ProfileTabContentSkeleton } from "@/components/skeletons";
import classes from "@/features/profile/profile.module.css";

export const metadata = {
  title: "Profil",
};

export default function Page() {
  return (
    <>
      <PageContainer className={classes.page}>
        <PageHeader title="Profil Saya" />

        <Suspense fallback={<ProfileTabContentSkeleton />}>
          <ProfileTabSection />
        </Suspense>
      </PageContainer>
    </>
  );
}
