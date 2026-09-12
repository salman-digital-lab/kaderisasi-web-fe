"use client";
import Link from "next/link";
import { Badge, Box, Button, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAward, IconCalendarEvent } from "@tabler/icons-react";
import type { ReactElement } from "react";
import CatalogueImage from "@/components/common/Catalogue/CatalogueImage";
import { ACTIVITY_REGISTRANT_STATUS_ENUM as Status } from "@/types/constants/activity";
import { getCertificateCta } from "@/features/certificate/utils/certificateData";
import type { CertificateLifecycleState } from "@/types/model/certificate";
import classes from "./index.module.css";
import shared from "@/features/profile/profile.module.css";

type ActivityCardProps = {
  activityName: string;
  registrationStatus: string;
  slug: string;
  imageUrl?: string;
  visibleAt?: string;
  registrationId?: number;
  hasCertificate?: boolean;
  certificateCode?: string | null;
  certificateState?: CertificateLifecycleState;
};
function statusColor(status: string): string {
  if (status === Status.DITERIMA || status === Status.LULUS_KEGIATAN)
    return "green";
  if (status === Status.TIDAK_DITERIMA || status === Status.TIDAK_LULUS)
    return "red";
  return status === Status.BELUM_DIUMUMKAN ? "orange" : "blue";
}
export default function ActivityPersonalCard({
  activityName,
  registrationStatus,
  slug,
  imageUrl,
  visibleAt,
  registrationId,
  hasCertificate,
  certificateCode,
  certificateState,
}: ActivityCardProps): ReactElement {
  const certificate = getCertificateCta({
    certificateCode,
    certificateState,
    hasTemplate: Boolean(hasCertificate),
    isPassed: registrationStatus === Status.LULUS_KEGIATAN,
    registrationId,
  });
  return (
    <Paper
      component="article"
      withBorder
      p={{ base: "md", sm: "lg" }}
      className={classes.row}
    >
      <div className={classes.thumbnail}>
        <CatalogueImage
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : undefined
          }
          alt={activityName}
          variant="poster"
          fallback={<IconCalendarEvent size={28} stroke={1.5} aria-hidden />}
        />
      </div>
      <Stack gap="xs" className={classes.details}>
        <Title order={3} size="h4">
          {activityName}
        </Title>
        <Box>
          <Badge
            variant="light"
            tt="none"
            color={statusColor(registrationStatus)}
            className={shared.badge}
          >
            {registrationStatus.charAt(0) +
              registrationStatus.slice(1).toLowerCase()}
          </Badge>
        </Box>
        {registrationStatus === Status.BELUM_DIUMUMKAN && visibleAt && (
          <Text c="dimmed" size="sm">
            Diumumkan:{" "}
            {new Date(visibleAt).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        <div className={shared.actions}>
          <Button
            component={Link}
            href={`/profile/activity/${slug}`}
            variant="light"
            aria-label={`Lihat detail ${activityName}`}
          >
            Lihat detail
          </Button>
          {registrationStatus === Status.TERDAFTAR && (
            <Button
              component={Link}
              href={`/profile/activity/${slug}?edit=form`}
              variant="outline"
              aria-label={`Edit formulir ${activityName}`}
            >
              Edit formulir
            </Button>
          )}
          {certificate && (
            <Button
              component={Link}
              href={certificate.href}
              color={certificate.color}
              variant="light"
              leftSection={<IconAward size={16} aria-hidden />}
            >
              {certificate.label}
            </Button>
          )}
        </div>
      </Stack>
    </Paper>
  );
}
