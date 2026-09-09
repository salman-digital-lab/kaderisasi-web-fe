"use client";

import LinkButton from "@/components/common/LinkButton";

import dayjs from "dayjs";
import "dayjs/locale/id";
import NextImage from "next/image";
import { Text, Group, Badge, rem, Card } from "@mantine/core";
import classes from "./index.module.css";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { IconCalendarTime, IconCalendarEvent } from "@tabler/icons-react";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";

// Set the locale globally for this component
dayjs.locale("id");

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
  const calendarIcon = (
    <IconCalendarTime style={{ width: rem(14), height: rem(14) }} />
  );

  return (
    <Card
      component="article"
      withBorder
      radius="md"
      p="md"
      className={classes.card}
    >
      <Card.Section>
        <div className={classes.media}>
          {imageUrl ? (
            <NextImage
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`}
              alt={activityName}
              height={350}
              width={400}
              sizes="(max-width: 48em) 100vw, (max-width: 75em) 50vw, 25vw"
              className={classes.image}
            />
          ) : (
            <IconCalendarEvent size={48} stroke={1.5} aria-hidden />
          )}
        </div>
      </Card.Section>

      <Card.Section className={classes.section} mt="sm" flex="1">
        <Group justify="space-between">
          <Text fz="md" fw={600}>
            {activityName}
          </Text>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="sm" className={classes.label} c="dimmed">
          Tutup Pendaftaran
        </Text>
        <Group gap={7} mt={5}>
          <Badge variant="light" color="red" leftSection={calendarIcon}>
            {dayjs(registrationEnd).format("DD MMMM YYYY")}
          </Badge>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="sm" className={classes.label} c="dimmed">
          Jenjang Minimum
        </Text>
        <Group gap={7} mt={5}>
          <Badge variant="light">{USER_LEVEL_RENDER[minimumLevel]}</Badge>
        </Group>
      </Card.Section>

      <Group mt="sm">
        <LinkButton
          aria-label={`Lihat kegiatan ${activityName}`}
          href={`/activity/${slug}`}
          radius="md"
          fullWidth
        >
          Lihat Selengkapnya
        </LinkButton>
      </Group>
    </Card>
  );
}
