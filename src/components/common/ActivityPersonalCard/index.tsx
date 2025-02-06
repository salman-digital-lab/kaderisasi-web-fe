"use client";

import Link from "next/link";
import { Card, Image, Text, Group, Badge, Button, rem } from "@mantine/core";
import classes from "./index.module.css";

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
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : "https://placehold.co/350x400?text=" + activityName
          }
          alt={activityName}
          height={350}
        />
      </Card.Section>

      <Card.Section className={classes.section} mt="md" flex="1">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {activityName}
          </Text>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="lg" className={classes.label} c="dimmed">
          Status
        </Text>
        <Group gap={7} mt={5}>
          <Badge size="lg" variant="light">
            {registrationStatus}
          </Badge>
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button
          component={Link}
          href={`/activity/${slug}`}
          radius="md"
          style={{ flex: 1 }}
        >
          Lihat
        </Button>
        <Button
          component={Link}
          href={`/activity/register/${slug}/edit-activity-form`}
          radius="md"
          style={{ flex: 1 }}
        >
          Ubah Formulir
        </Button>
      </Group>
    </Card>
  );
}
