"use client";

import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";
import NextImage from "next/image";
import { Image, Text, Group, Badge, Button, rem, Card } from "@mantine/core";
import classes from "./index.module.css";
import { IconCalendarTime, IconUsers } from "@tabler/icons-react";

// Set the locale globally for this component
dayjs.locale("id");

type ClubCardProps = {
  id: number;
  name: string;
  short_description: string | null;
  logo: string;
  start_period: string | null;
  end_period: string | null;
};

export default function ClubCard({
  id,
  name,
  short_description,
  logo,
  start_period,
  end_period,
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
          {logo ? (
            <NextImage
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${logo}`}
              width={80}
              height={80}
              alt={name}
              className={classes.logo}
            />
          ) : (
            <div
              className={classes.logo}
              style={{
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconUsers size={40} />
            </div>
          )}
        </Group>
        <Text fz="lg" fw={500} ta="center" lineClamp={2}>
          {name}
        </Text>
        {short_description && (
          <Text size="sm" c="dimmed" ta="center" lineClamp={3} mt="xs">
            {short_description}
          </Text>
        )}
      </Card.Section>

      {(start_period || end_period) && (
        <Card.Section className={`${classes.section} ${classes.periodSection}`}>
          <Text className={classes.label} c="dimmed">
            Periode Aktivitas
          </Text>
          <Group gap={7} mt={5} justify="center">
            <Badge variant="light" color="blue" leftSection={calendarIcon}>
              {start_period && end_period 
                ? `${dayjs(start_period).format("MMM YYYY")} - ${dayjs(end_period).format("MMM YYYY")}`
                : start_period 
                  ? dayjs(start_period).format("MMM YYYY")
                  : `s/d ${dayjs(end_period).format("MMM YYYY")}`
              }
            </Badge>
          </Group>
        </Card.Section>
      )}

      <Group mt="xs" className={classes.buttonSection}>
        <Link href={`/clubs/${id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <Button radius="md" fullWidth>
            Lihat Detail
          </Button>
        </Link>
      </Group>
    </Card>
  );
}
