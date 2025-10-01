"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Card, Image, Text, Group, Badge, Button, Stack, Box } from "@mantine/core";

type ActivityCardProps = {
  activityName: string;
  registrationStatus: string;
  slug: string;
  imageUrl?: string;
};

export default function ActivityPersonalCard({
  activityName,
  registrationStatus,
  slug,
  imageUrl,
}: ActivityCardProps) {
  return (
    <Card withBorder radius="md" p="md" h="100%">
      <Card.Section>
        <Image
          component={NextImage}
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
          fit="cover"
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
            <Badge size="sm" variant="light">
              {registrationStatus}
            </Badge>
          </Group>
        </Box>
      </Stack>

      <Stack mt="md" gap="xs">
        <Button
          component={Link}
          href={`/activity/${slug}`}
          radius="md"
          variant="filled"
          fullWidth
        >
          Lihat Detail
        </Button>
        <Button
          component={Link}
          href={`/activity/register/${slug}/edit-activity-form`}
          radius="md"
          variant="outline"
          fullWidth
        >
          Edit Formulir
        </Button>
      </Stack>
    </Card>
  );
}
