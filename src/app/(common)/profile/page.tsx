import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Suspense } from "react";
import { Box, SimpleGrid } from "@mantine/core";

import ProfileCardSection from "@/components/profile/ProfileCardSection";
import ProfileTabSection from "@/components/profile/ProfileTabSection";
import {
  ProfileCardSkeleton,
  ProfileTabContentSkeleton,
} from "@/components/skeletons";

import classes from "./index.module.css";

export const metadata = {
  title: "Profil",
};

export default function Page() {
  return (
    <>
      <PageContainer>
        <PageHeader
          title="Profil Saya"
          description="Kelola data diri, kegiatan, dan prestasi Anda"
        />

        {/* Profile Content - each column streams independently */}
        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing="xl"
          className={classes.content}
        >
          <Box className={classes.profileSection}>
            <Suspense fallback={<ProfileCardSkeleton />}>
              <ProfileCardSection />
            </Suspense>
          </Box>
          <Box className={classes.contentSection}>
            <Suspense fallback={<ProfileTabContentSkeleton />}>
              <ProfileTabSection />
            </Suspense>
          </Box>
        </SimpleGrid>
      </PageContainer>
    </>
  );
}
