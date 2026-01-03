import {
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Box,
  Divider,
  Card,
  SimpleGrid,
} from "@mantine/core";
import {
  IconLogout,
  IconUser,
  IconTrophy,
  IconCalendar,
} from "@tabler/icons-react";

import { getProfile, getProvinces } from "@/services/profile";
import { verifySession } from "@/functions/server/session";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import { getActivitiesRegistration } from "@/services/activity";
import { ProfileTab } from "@/features/profile/ProfileTab";
import { ProfilePicture } from "@/features/profile/ProfilePicture";
import { getRuangCurhat } from "@/services/ruangcurhat";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { getMyAchievements } from "@/services/leaderboard";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";

import classes from "@/app/(common)/profile/index.module.css";

export async function ProfileContent() {
  const sessionData = await verifySession();

  try {
    const [provinceData, profileData, activitiesRegistration, ruangCurhatData, achievements] = 
      await Promise.all([
        getProvinces(),
        getProfile(sessionData.session || ""),
        getActivitiesRegistration(sessionData.session || ""),
        getRuangCurhat(sessionData.session || ""),
        getMyAchievements(sessionData.session || ""),
      ]);

    return (
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing="xl"
        className={classes.content}
      >
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
                <Text size="h3" fw={700} mb="xs">
                  {profileData?.profile.name || "Nama Pengguna"}
                </Text>
              </Box>

              {profileData?.profile.badges &&
                profileData.profile.badges.length > 0 && (
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
                  <IconCalendar size={20} style={{ margin: "0 auto 4px" }} />
                  <Text size="xs" c="dimmed">
                    Kegiatan
                  </Text>
                  <Text fw={500} size="sm">
                    {activitiesRegistration?.length || 0}
                  </Text>
                </Box>
                <Box ta="center">
                  <IconTrophy size={20} style={{ margin: "0 auto 4px" }} />
                  <Text size="xs" c="dimmed">
                    Prestasi
                  </Text>
                  <Text fw={500} size="sm">
                    {achievements?.length || 0}
                  </Text>
                </Box>
                <Box ta="center">
                  <IconUser size={20} style={{ margin: "0 auto 4px" }} />
                  <Text size="xs" c="dimmed">
                    Level
                  </Text>
                  <Text fw={500} size="sm">
                    {
                      USER_LEVEL_RENDER[
                        profileData?.profile.level || USER_LEVEL_ENUM.JAMAAH
                      ]
                    }
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
            token={sessionData.session || ""}
          />
        </Box>
      </SimpleGrid>
    );
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
    return <ErrorWrapper message="Terjadi kesalahan" />;
  }
}

export default ProfileContent;

