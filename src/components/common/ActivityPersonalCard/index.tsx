"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Card, Text, Group, Badge, Button, Stack, Box } from "@mantine/core";
import { IconClock, IconAward } from "@tabler/icons-react";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import { getCertificateCta } from "@/features/certificate/utils/certificateData";
import type { CertificateLifecycleState } from "@/types/model/certificate";

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

// Format date to readable string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get badge color based on status
const getStatusColor = (status: string): string => {
  switch (status) {
    case ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN:
      return "green";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS:
      return "red";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TERDAFTAR:
      return "blue";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN:
      return "orange";
    default:
      return "gray";
  }
};

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
}: ActivityCardProps) {
  const isUnannounced =
    registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN;

  const certificateCta = getCertificateCta({
    certificateCode,
    certificateState,
    hasTemplate: Boolean(hasCertificate),
    isPassed:
      registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN,
    registrationId,
  });

  const canEditForm =
    registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.TERDAFTAR;

  return (
    <Card withBorder radius="md" p="md" h="100%">
      <Card.Section>
        <NextImage
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0qAcAAQUAwRZaSmYAAAAASUVORK5CYII="
          placeholder="blur"
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : "https://placehold.co/350x400?text=" + activityName
          }
          alt={activityName}
          height={200}
          width={400}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </Card.Section>

      <Stack gap="sm" mt="md" flex="1">
        <Text fz="lg" fw={500} lineClamp={2}>
          {activityName}
        </Text>

        <Box>
          <Text size="md" c="dimmed" tt="uppercase" fw={700}>
            Status
          </Text>
          <Group gap="xs" mt={4}>
            <Badge
              size="md"
              variant="light"
              color={getStatusColor(registrationStatus)}
            >
              {registrationStatus}
            </Badge>
          </Group>
          {isUnannounced && visibleAt && (
            <Group gap={4} mt={8}>
              <IconClock size={14} color="var(--mantine-color-orange-6)" />
              <Text size="md" c="orange.6">
                Diumumkan: {formatDate(visibleAt)}
              </Text>
            </Group>
          )}
        </Box>
      </Stack>

      <Stack mt="md" gap="xs">
        <Button
          component={Link}
          fullWidth
          href={`/profile/activity/${slug}`}
          radius="md"
          variant="filled"
        >
          Lihat Detail
        </Button>
        {canEditForm && (
          <Button
            component={Link}
            fullWidth
            href={`/activity/register/${slug}/edit-activity-form`}
            radius="md"
            variant="outline"
          >
            Edit Formulir
          </Button>
        )}
        {certificateCta && (
          <Button
            color={certificateCta.color}
            component={Link}
            fullWidth
            href={certificateCta.href}
            leftSection={<IconAward aria-hidden size={16} />}
            radius="md"
            variant="light"
          >
            {certificateCta.label}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
