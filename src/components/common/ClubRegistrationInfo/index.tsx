import { Paper, Title, Stack, ThemeIcon, Group, Box } from "@mantine/core";
import { IconClipboardList } from "@tabler/icons-react";
import type { RegistrationInfo } from "@/types/model/club";
import classes from "./index.module.css";

interface ClubRegistrationInfoProps {
  registrationInfo?: RegistrationInfo;
}

export default function ClubRegistrationInfo({
  registrationInfo,
}: ClubRegistrationInfoProps) {
  if (
    !registrationInfo?.registration_info ||
    registrationInfo.registration_info.trim() === ""
  ) {
    return null;
  }

  return (
    <Paper
      p="xl"
      radius="md"
      shadow="sm"
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-cyan-0) 100%)",
        border: "2px solid var(--mantine-color-blue-2)",
      }}
    >
      <Stack gap="md">
        <Group gap="sm" align="center">
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconClipboardList size={20} />
          </ThemeIcon>
          <Title order={3} c="blue.8">
            Informasi Pendaftaran
          </Title>
        </Group>

        <Paper p="lg" radius="sm" bg="white" shadow="xs">
          <Box
            className={classes.content}
            dangerouslySetInnerHTML={{
              __html: registrationInfo.registration_info,
            }}
          />
        </Paper>
      </Stack>
    </Paper>
  );
}
