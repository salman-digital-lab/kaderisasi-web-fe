import { Suspense } from "react";
import { Container, Box, Title, Text } from "@mantine/core";

import ProfileContent from "@/components/profile/ProfileContent";
import ProfileContentSkeleton from "@/components/profile/ProfileContentSkeleton";

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

        {/* Profile Content - Streamed with Suspense */}
        <Suspense fallback={<ProfileContentSkeleton />}>
          <ProfileContent />
        </Suspense>
      </Container>
    </main>
  );
}
