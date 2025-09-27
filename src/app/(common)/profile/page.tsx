import {
  Text,
  Button,
  Paper,
  Container,
  Flex,
  Group,
  Badge,
  Title,
  Stack,
  Grid,
  GridCol,
  Card,
  ThemeIcon,
  Box,
  Center,
  Divider,
} from "@mantine/core";
import { IconUser, IconLogout, IconTrophy, IconActivity, IconHeart } from "@tabler/icons-react";
import Link from "next/link";

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

  // Quick stats calculation
  const totalActivities = activitiesRegistration?.length || 0;
  const totalAchievements = achievements?.length || 0;
  const totalCurhatSessions = ruangCurhatData?.length || 0;

  return (
    <main>
      <Container size="lg" py="xl">
        <Grid gutter="xl">
          {/* Profile Card */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="xl" radius="md" withBorder className={classes.profileCard}>
              <Stack align="center" gap="md">
                <ProfilePicture
                  src={profileData?.profile.picture}
                  token={sessionData.session || ""}
                  size={140}
                />
                
                <Stack align="center" gap="xs">
                  <Title order={2} ta="center" size="h3">
                    {profileData?.profile.name}
                  </Title>
                  <Badge 
                    variant="light" 
                    size="lg" 
                    leftSection={<IconUser size={16} />}
                  >
                    {profileData &&
                      USER_LEVEL_RENDER[
                        profileData.profile.level || USER_LEVEL_ENUM.JAMAAH
                      ]}
                  </Badge>
                </Stack>

                {/* Badges */}
                {profileData?.profile.badges && profileData.profile.badges.length > 0 && (
                  <Box w="100%">
                    <Text size="sm" fw={500} mb="xs" ta="center" c="dimmed">
                      Badges
                    </Text>
                    <Group gap="xs" justify="center">
                      {profileData.profile.badges.map((badge) => (
                        <Badge key={badge} variant="outline" size="sm">
                          {badge}
                        </Badge>
                      ))}
                    </Group>
                  </Box>
                )}

                <Divider w="100%" />

                {/* Quick Stats */}
                <Grid w="100%" gutter="xs">
                  <GridCol span={4}>
                    <Stack align="center" gap="xs">
                      <ThemeIcon variant="light" color="blue" size="lg">
                        <IconActivity size={18} />
                      </ThemeIcon>
                      <Text size="xl" fw={700} c="blue">
                        {totalActivities}
                      </Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Kegiatan
                      </Text>
                    </Stack>
                  </GridCol>
                  <GridCol span={4}>
                    <Stack align="center" gap="xs">
                      <ThemeIcon variant="light" color="yellow" size="lg">
                        <IconTrophy size={18} />
                      </ThemeIcon>
                      <Text size="xl" fw={700} c="yellow">
                        {totalAchievements}
                      </Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Prestasi
                      </Text>
                    </Stack>
                  </GridCol>
                  <GridCol span={4}>
                    <Stack align="center" gap="xs">
                      <ThemeIcon variant="light" color="pink" size="lg">
                        <IconHeart size={18} />
                      </ThemeIcon>
                      <Text size="xl" fw={700} c="pink">
                        {totalCurhatSessions}
                      </Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Curhat
                      </Text>
                    </Stack>
                  </GridCol>
                </Grid>

                <Button 
                  variant="light" 
                  color="red" 
                  fullWidth 
                  leftSection={<IconLogout size={16} />}
                  size="md"
                  component={Link}
                  href="/api/logout"
                >
                  Keluar
                </Button>
              </Stack>
            </Card>
          </GridCol>

          {/* Profile Content */}
          <GridCol span={{ base: 12, md: 8 }}>
            <ProfileTab
              profileData={profileData}
              provinceData={provinceData}
              activitiesRegistration={activitiesRegistration}
              ruangcurhatData={ruangCurhatData}
              achievements={achievements}
            />
          </GridCol>
        </Grid>
      </Container>
    </main>
  );
}
