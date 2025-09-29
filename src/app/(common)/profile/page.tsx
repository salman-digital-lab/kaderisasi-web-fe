import {
  Text,
  Button,
  Container,
  Stack,
  Group,
  Badge,
  Title,
  SimpleGrid,
  Box,
  Divider,
  Card,
} from "@mantine/core";
import { IconLogout, IconUser, IconTrophy, IconCalendar } from "@tabler/icons-react";

import { getProfile, getProvinces } from "../../../services/profile";

import ErrorWrapper from "../../../components/layout/Error";
import { verifySession } from "../../../functions/server/session";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { getActivitiesRegistration } from "../../../services/activity";
import { ProfileTab } from "../../../features/profile/ProfileTab";
import { ProfilePicture } from "../../../features/profile/ProfilePicture";

import classes from "./index.module.css";
import { getRuangCurhat } from "../../../services/ruangcurhat";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { Activity, Registrant } from "@/types/model/activity";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import { redirect } from "next/navigation";
import { Achievement } from "@/types/model/achievement";
import { getMyAchievements } from "@/services/leaderboard";

export const metadata = {
  title: "Profil",
};

export default async function Page() {
  let provinceData: Province[] | undefined;
  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  let activitiesRegistration:
    | ({ activity: Activity } & Registrant)[]
    | undefined;

  let ruangCurhatData: RuangCurhatData[] | undefined;
  let achievements: Achievement[] | undefined;

  const sessionData = await verifySession();

  try {
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");
    activitiesRegistration = await getActivitiesRegistration(
      sessionData.session || "",
    );
    ruangCurhatData = await getRuangCurhat(sessionData.session || "");
    achievements = await getMyAchievements(sessionData.session || "");
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
  }

  return (
    <main className={classes.container}>
      <Container size="lg" py="xl">
        {/* Header Section */}
        <Box mb="xl">
          <Title order={1} ta="center" mb="xs">
            Profil Saya
          </Title>
          <Text ta="center" c="dimmed" size="lg">
            Kelola data diri, kegiatan, dan prestasi Anda
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" className={classes.content}>
          {/* Profile Card */}
          <Box className={classes.profileSection}>
            <Card radius="lg" withBorder p="xl" className={classes.profileCard}>
              <Stack align="center" gap="md">
                <ProfilePicture
                  src={profileData?.profile.picture}
                  token={sessionData.session || ""}
                  size={120}
                  radius={60}
                />
                
                <Box ta="center">
                  <Title order={2} size="h3" mb="xs">
                    {profileData?.profile.name || "Nama Pengguna"}
                  </Title>
                  <Text c="dimmed" size="sm" mb="md">
                    {profileData &&
                      USER_LEVEL_RENDER[
                        profileData.profile.level || USER_LEVEL_ENUM.JAMAAH
                      ]}
                  </Text>
                </Box>

                {profileData?.profile.badges && profileData.profile.badges.length > 0 && (
                  <>
                    <Divider w="100%" />
                    <Box w="100%">
                      <Text size="sm" fw={500} mb="xs" ta="center">
                        Lencana
                      </Text>
                      <Group gap="xs" justify="center">
                        {profileData.profile.badges.map((badge) => (
                          <Badge key={badge} variant="light" size="sm">
                            {badge}
                          </Badge>
                        ))}
                      </Group>
                    </Box>
                  </>
                )}

                <Divider w="100%" />
                
                {/* Quick Stats */}
                <SimpleGrid cols={3} w="100%" spacing="xs">
                  <Box ta="center">
                    <IconCalendar size={20} style={{ margin: '0 auto 4px' }} />
                    <Text size="xs" c="dimmed">Kegiatan</Text>
                    <Text fw={500} size="sm">
                      {activitiesRegistration?.length || 0}
                    </Text>
                  </Box>
                  <Box ta="center">
                    <IconTrophy size={20} style={{ margin: '0 auto 4px' }} />
                    <Text size="xs" c="dimmed">Prestasi</Text>
                    <Text fw={500} size="sm">
                      {achievements?.length || 0}
                    </Text>
                  </Box>
                  <Box ta="center">
                    <IconUser size={20} style={{ margin: '0 auto 4px' }} />
                    <Text size="xs" c="dimmed">Level</Text>
                    <Text fw={500} size="sm">
                      {profileData?.profile.level || "Jamaah"}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Divider w="100%" />

                <Button 
                  variant="light" 
                  color="red" 
                  fullWidth 
                  leftSection={<IconLogout size={16} />}
                  radius="md"
                >
                  Keluar
                </Button>
              </Stack>
            </Card>
          </Box>

          {/* Content Section */}
          <Box className={classes.contentSection}>
            <ProfileTab
              profileData={profileData}
              provinceData={provinceData}
              activitiesRegistration={activitiesRegistration}
              ruangcurhatData={ruangCurhatData}
              achievements={achievements}
            />
          </Box>
        </SimpleGrid>
      </Container>
    </main>
  );
}
