import { Badge, Button, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconCertificate,
  IconCheck,
  IconClock,
  IconClipboardCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import type { ReactElement } from "react";
import Link from "next/link";
import { ACTIVITY_REGISTRANT_STATUS_ENUM as Status } from "@/types/constants/activity";
import { getCertificateCta } from "@/features/certificate/utils/certificateData";
import { formatStatusDate, statusLabel } from "./status-utils";
import type { ActivityHistoryItem } from "@/types/api/profile-history";
import classes from "./status.module.css";

function statusPresentation(status: string): { color: string; icon: Icon } {
  switch (status) {
    case Status.DITERIMA:
    case Status.LULUS_KEGIATAN:
      return { color: "green", icon: IconCheck };
    case Status.TIDAK_DITERIMA:
    case Status.TIDAK_LULUS:
      return { color: "red", icon: IconX };
    case Status.BELUM_DIUMUMKAN:
      return { color: "orange", icon: IconClock };
    case Status.TERDAFTAR:
      return { color: "blue", icon: IconClipboardCheck };
    default:
      return { color: "gray", icon: IconInfoCircle };
  }
}

export default function StatusRegistrationCard({
  registration,
}: {
  registration: ActivityHistoryItem;
}): ReactElement {
  const { status } = registration;
  const { color, icon: StatusIcon } = statusPresentation(status);
  const registeredAt = formatStatusDate(registration.created_at ?? undefined);
  const announcement = formatStatusDate(
    registration.visible_at ?? undefined,
    true,
  );
  const certificate = getCertificateCta({
    certificateCode: registration.certificate_code,
    certificateState: registration.certificate_state,
    hasTemplate: registration.has_certificate,
    isPassed: status === Status.LULUS_KEGIATAN,
    registrationId: registration.id,
  });

  return (
    <Paper
      component="article"
      aria-labelledby={`registration-${registration.id}`}
      withBorder
      p={{ base: "md", sm: "lg" }}
      className={classes.card}
    >
      <Stack gap="sm">
        <Title
          id={`registration-${registration.id}`}
          order={3}
          className={classes.activityTitle}
        >
          {registration.activity_name}
        </Title>
        <Badge
          tt="none"
          variant="light"
          color={color}
          leftSection={<StatusIcon size={16} aria-hidden />}
          className={classes.badge}
        >
          {statusLabel(status)}
        </Badge>
        <Text c="dimmed" size="sm">
          {registeredAt ? (
            <>
              Terdaftar pada{" "}
              <time dateTime={registration.created_at ?? undefined}>
                {registeredAt}
              </time>
            </>
          ) : (
            "Tanggal pendaftaran belum tersedia"
          )}
        </Text>
        {status === Status.BELUM_DIUMUMKAN && (
          <Text className={classes.announcement}>
            {announcement ? (
              <>
                Jadwal pengumuman:{" "}
                <time dateTime={registration.visible_at ?? undefined}>
                  {announcement}
                </time>
              </>
            ) : (
              "Jadwal pengumuman belum tersedia."
            )}
          </Text>
        )}
        <div className={classes.actions}>
          <Button
            component={Link}
            href={`/activity/${registration.activity_slug}`}
            variant="light"
            aria-label={`Detail kegiatan ${registration.activity_name}`}
          >
            Detail kegiatan
          </Button>
          {certificate && (
            <Button
              component={Link}
              href={certificate.href}
              color={certificate.color}
              variant="light"
              className={classes.certificateAction}
              leftSection={<IconCertificate size={18} aria-hidden />}
              aria-label={`${certificate.label}: ${registration.activity_name}`}
            >
              {certificate.label}
            </Button>
          )}
        </div>
      </Stack>
    </Paper>
  );
}
