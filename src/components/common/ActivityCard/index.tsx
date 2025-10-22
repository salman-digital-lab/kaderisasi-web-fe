"use client";

import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";
import NextImage from "next/image";
import { Text, Group, Badge, Button, rem, Card } from "@mantine/core";
import classes from "./index.module.css";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { IconCalendarTime } from "@tabler/icons-react";
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
  const calenderIcon = (
    <IconCalendarTime style={{ width: rem(12), height: rem(12) }} />
  );

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <NextImage
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0qAcAAQUAwRZaSmYAAAAASUVORK5CYII="
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : "https://placehold.co/350x400?text=" + activityName
          }
          alt={activityName}
          height={350}
          width={400}
          style={{ width: '100%', height: 'auto' }}
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
            {dayjs(registrationEnd).format("DD MMMM YYYY")}
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
        <Link href={`/activity/${slug}`} style={{ flex: 1, textDecoration: 'none' }}>
          <Button radius="md" fullWidth>
            Lihat Selengkapnya
          </Button>
        </Link>
      </Group>
    </Card>
  );
}
