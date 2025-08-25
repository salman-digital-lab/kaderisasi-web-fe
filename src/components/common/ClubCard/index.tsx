"use client";

import dayjs from "dayjs";
import Link from "next/link";
import NextImage from "next/image";
import { Image, Text, Group, Badge, Button, rem, Card, Avatar } from "@mantine/core";
import classes from "./index.module.css";
import { IconCalendarTime, IconUsers } from "@tabler/icons-react";
import "dayjs/locale/id";

type ClubCardProps = {
  id: number;
  name: string;
  logo: string;
  startPeriod: string | null;
  endPeriod: string | null;
};

export default function ClubCard({
  id,
  name,
  logo,
  startPeriod,
  endPeriod,
}: ClubCardProps) {
  const calendarIcon = (
    <IconCalendarTime style={{ width: rem(12), height: rem(12) }} />
  );

  const clubIcon = (
    <IconUsers style={{ width: rem(12), height: rem(12) }} />
  );

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section}>
        <Group align="center" justify="center" mb="md">
          <Avatar
            src={logo ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${logo}` : null}
            size={80}
            radius="xl"
            className={classes.logo}
          >
            {!logo && <IconUsers size={40} />}
          </Avatar>
        </Group>
        <Text fz="lg" fw={500} ta="center" lineClamp={2}>
          {name}
        </Text>
      </Card.Section>

      {(startPeriod || endPeriod) && (
        <Card.Section className={classes.section}>
          <Text className={classes.label} c="dimmed">
            Periode Aktivitas
          </Text>
          <Group gap={7} mt={5} justify="center">
            {startPeriod && (
              <Badge variant="light" color="blue" leftSection={calendarIcon}>
                {dayjs(startPeriod).locale("id").format("MMM YYYY")}
              </Badge>
            )}
            {endPeriod && (
              <Badge variant="light" color="orange" leftSection={calendarIcon}>
                s/d {dayjs(endPeriod).locale("id").format("MMM YYYY")}
              </Badge>
            )}
          </Group>
        </Card.Section>
      )}

      <Group mt="xs">
        <Button
          component={Link}
          href={`/clubs/${id}`}
          radius="md"
          style={{ flex: 1 }}
        >
          Lihat Detail
        </Button>
      </Group>
    </Card>
  );
}
