"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Card, Text, Group, Badge, Button, Stack, Box } from "@mantine/core";
import { IconClock, IconAward } from "@tabler/icons-react";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";

type ActivityCardProps = {
  activityName: string;
  registrationStatus: string;
  slug: string;
  imageUrl?: string;
  visibleAt?: string;
  registrationId?: number;
  hasCertificate?: boolean;
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
}: ActivityCardProps) {
  const isUnannounced =
    registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN;

  const canViewCertificate = registrationId && hasCertificate &&
    (registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN ||
     registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA);

  const canEditForm = registrationStatus === ACTIVITY_REGISTRANT_STATUS_ENUM.TERDAFTAR;

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
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Status
          </Text>
          <Group gap="xs" mt={4}>
            <Badge
              size="sm"
              variant="light"
              color={getStatusColor(registrationStatus)}
            >
              {registrationStatus}
            </Badge>
          </Group>
          {isUnannounced && visibleAt && (
            <Group gap={4} mt={8}>
              <IconClock size={14} color="var(--mantine-color-orange-6)" />
              <Text size="xs" c="orange.6">
                Diumumkan: {formatDate(visibleAt)}
              </Text>
            </Group>
          )}
        </Box>
      </Stack>

      <Stack mt="md" gap="xs">
        <Link href={`/profile/activity/${slug}`} style={{ textDecoration: "none" }}>
          <Button radius="md" variant="filled" fullWidth>
            Lihat Detail
          </Button>
        </Link>
        {canEditForm && (
          <Link
            href={`/activity/register/${slug}/edit-activity-form`}
            style={{ textDecoration: "none" }}
          >
            <Button radius="md" variant="outline" fullWidth>
              Edit Formulir
            </Button>
          </Link>
        )}
        {canViewCertificate && (
          <Link
            href={`/certificate/${registrationId}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              radius="md"
              variant="light"
              color="yellow"
              fullWidth
              leftSection={<IconAward size={16} />}
            >
              Lihat Sertifikat
            </Button>
          </Link>
        )}
      </Stack>
    </Card>
  );
}
