"use client";

import {
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Title,
  SimpleGrid,
  Box,
  Divider,
  Card,
} from "@mantine/core";
import {
  IconLogout,
  IconUser,
  IconTrophy,
  IconCalendar,
} from "@tabler/icons-react";

import { ProfilePicture } from "../ProfilePicture";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { PublicUser, Member } from "@/types/model/members";
import { Activity, Registrant } from "@/types/model/activity";
import { Achievement } from "@/types/model/achievement";

import classes from "./index.module.css";

type ProfileCardProps = {
  profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;
  activitiesRegistration: ({ activity: Activity } & Registrant)[] | undefined;
  achievements: Achievement[] | undefined;
  token: string;
  className?: string;
  showLogoutButton?: boolean;
};

export function ProfileCard({
  profileData,
  activitiesRegistration,
  achievements,
  token,
  className,
  showLogoutButton = true,
}: ProfileCardProps) {
  return (
    <Box className={className}>
      <Card radius="lg" withBorder p="xl" className={classes.profileCard}>
        <Stack align="center" gap="md">
          <ProfilePicture
            src={profileData?.profile.picture}
            token={token}
            size={120}
            radius={60}
          />

          <Box ta="center">
            <Title order={2} size="h3" mb="xs">
              {profileData?.profile.name || "Nama Pengguna"}
            </Title>
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

          {showLogoutButton && (
            <>
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
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

