"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { Image, Text, Group, Badge, Button, rem, Card } from "@mantine/core";
import classes from "./index.module.css";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { IconCalendarTime } from "@tabler/icons-react";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import 'dayjs/locale/id'

type ActivityCardProps = {
  activityName: string;
  registrationEnd: string;
  slug: string;
  minimumLevel: USER_LEVEL_ENUM;
  imageUrl?: string;
};

export default function ActivityCard({
  activityName,
  registrationEnd,
  slug,
  minimumLevel,
  imageUrl,
}: ActivityCardProps) {
  const calenderIcon = (
    <IconCalendarTime style={{ width: rem(12), height: rem(12) }} />
  );

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
        <Text mt="md" className={classes.label} c="dimmed">
          Tutup Pendaftaran
        </Text>
        <Group gap={7} mt={5}>
          <Badge variant="light" color="red" leftSection={calenderIcon}>
            {dayjs(registrationEnd).locale('id').format("DD MMMM YYYY")}
          </Badge>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Jenjang Minimum
        </Text>
        <Group gap={7} mt={5}>
          <Badge size="sm" variant="light">
            {USER_LEVEL_RENDER[minimumLevel]}
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
          Lihat Selengkapnya
        </Button>
      </Group>
    </Card>
  );
}
