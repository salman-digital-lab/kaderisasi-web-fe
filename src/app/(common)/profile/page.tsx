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
        <PageHeader
          title="Profil Saya"
          description="Kelola data diri, kegiatan, sesi Ruang Curhat, dan prestasi Anda."
        />

        <Suspense fallback={<ProfileTabContentSkeleton />}>
          <ProfileTabSection />
        </Suspense>
      </PageContainer>
    </>
  );
}
