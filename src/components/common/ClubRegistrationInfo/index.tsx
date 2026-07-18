import { Paper, Stack, Text, Title } from "@mantine/core";
import ClubRichText from "@/components/common/ClubRichText";
import type { RegistrationInfo } from "@/types/model/club";
import classes from "./index.module.css";

interface ClubRegistrationInfoProps {
  registrationInfo?: RegistrationInfo;
  presentation: "open" | "closed";
}

export default function ClubRegistrationInfo({
  registrationInfo,
  presentation,
}: ClubRegistrationInfoProps) {
  if (
    !registrationInfo?.registration_info ||
    registrationInfo.registration_info.trim() === ""
  ) {
    return null;
  }

  const isClosed = presentation === "closed";
  const title = isClosed
    ? "Informasi Pendaftaran Sebelumnya"
    : "Informasi Pendaftaran";
  const headingId = `club-registration-info-${presentation}`;

  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      p={{ base: "md", sm: "lg", md: "xl" }}
      radius="md"
      withBorder
      className={classes.section}
    >
      <Stack gap="sm">
        <Title order={2} id={headingId} className={classes.title}>
          {title}
        </Title>
        {isClosed && (
          <Text className={classes.closedNote}>
            Pendaftaran klub ini telah ditutup. Informasi berikut ditampilkan
            sebagai referensi dari periode pendaftaran sebelumnya.
          </Text>
        )}
        <ClubRichText html={registrationInfo.registration_info} />
      </Stack>
    </Paper>
  );
}
