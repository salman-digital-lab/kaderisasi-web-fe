import { Badge, Group, Paper, Stack, Title } from "@mantine/core";
import type { ReactElement } from "react";
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
        <dl className={classes.identityFacts}>
          {userData.member_id && (
            <div>
              <dt>ID Anggota</dt>
              <dd>{userData.member_id}</dd>
            </div>
          )}
          <div>
            <dt>Jenjang</dt>
            <dd>
              {USER_LEVEL_RENDER[profile.level ?? USER_LEVEL_ENUM.JAMAAH]}
            </dd>
          </div>
        </dl>
        {!!profile.badges?.length && (
          <Group gap="xs" aria-label="Lencana anggota">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="light" size="md" tt="none">
                {badge}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
