import { Suspense } from "react";
import { Container, Box, Title, Text, SimpleGrid } from "@mantine/core";

import ProfileCardSection from "@/components/profile/ProfileCardSection";
import ProfileTabSection from "@/components/profile/ProfileTabSection";
import { ProfileCardSkeleton, ProfileTabContentSkeleton } from "@/components/skeletons";

import classes from "./index.module.css";

export const metadata = {
  title: "Profil",
};

export default function Page() {
  return (
    <main className={classes.container}>
      <Container size="lg" py="xl">
        {/* Header Section - Static content, renders immediately */}
        <Box mb="xl" className={classes.headerSection}>
          <Title order={1} ta="center" mb="xs">
            Profil Saya
          </Title>
          <Text ta="center" c="dimmed" size="lg">
            Kelola data diri, kegiatan, dan prestasi Anda
          </Text>
        </Box>

        {/* Profile Content - each column streams independently */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" className={classes.content}>
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
      </Container>
    </main>
  );
}
