import { Badge, Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import LogoutAction from "@/components/common/LogoutAction";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { ProfilePicture } from "./ProfilePicture";
import type { ProfileData } from "./types";
import classes from "./profile.module.css";
export default function ProfileHeader({
  profileData,
  token,
  savedName,
}: {
  profileData: ProfileData;
  token: string;
  savedName?: string;
}): ReactElement {
  const { profile, userData } = profileData;
  return (
    <Paper withBorder p={{ base: "md", sm: "lg" }} className={classes.identity}>
      <ProfilePicture
        src={profile.picture}
        token={token}
        size={72}
        radius={72}
      />
      <Stack gap="xs" className={classes.identityDetails}>
        <Title order={2} size="h3">
          {savedName ?? profile.name}
        </Title>
        <Group gap="sm">
          {userData.member_id && (
            <Text c="dimmed">ID Anggota: {userData.member_id}</Text>
          )}
          <Text fw={600}>
            {USER_LEVEL_RENDER[profile.level ?? USER_LEVEL_ENUM.JAMAAH]}
          </Text>
        </Group>
        {!!profile.badges?.length && (
          <Group gap="xs" aria-label="Lencana anggota">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="light" tt="none">
                {badge}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
      <Box className={classes.logout}>
        <LogoutAction />
      </Box>
    </Paper>
  );
}
