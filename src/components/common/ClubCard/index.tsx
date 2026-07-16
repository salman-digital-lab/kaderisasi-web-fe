"use client";

import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";
import NextImage from "next/image";
import { Text, Group, Badge, Button, rem, Card } from "@mantine/core";
import classes from "./index.module.css";
import { IconCalendarTime, IconUsers } from "@tabler/icons-react";
import type { ClubType } from "@/types/model/club";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";

// Set the locale globally for this component
dayjs.locale("id");

type ClubCardProps = {
  id: number;
  name: string;
  club_type?: ClubType;
  short_description: string | null;
  logo: string;
  start_period: string | null;
  end_period: string | null;
  is_registration_open?: boolean;
  registration_end_date?: string | null;
};

export default function ClubCard({
  id,
  name,
  club_type,
  short_description,
  logo,
  start_period,
  end_period,
  is_registration_open = false,
  registration_end_date,
}: ClubCardProps) {
  const registrationOpen = isClubRegistrationOpen({
    isRegistrationOpen: is_registration_open,
    registrationEndDate: registration_end_date,
  });
  const calendarIcon = (
    <IconCalendarTime
      style={{ width: rem(14), height: rem(14) }}
      aria-hidden="true"
    />
  );

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section}>
        <Group align="center" justify="center" mb="sm">
          {logo ? (
            <NextImage
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${logo}`}
              width={80}
              height={80}
              alt={name}
              className={classes.logo}
              sizes="80px"
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
              <IconUsers size={40} aria-hidden="true" />
            </div>
          )}
        </Group>
        <Text fz="md" fw={600} ta="center" lineClamp={2}>
          {name}
        </Text>
        {club_type && (
          <Group justify="center" mt="xs">
            <Badge
              color={club_type === "AVISMAN" ? "violet" : "blue"}
              variant="light"
            >
              {club_type}
            </Badge>
          </Group>
        )}
        <Group justify="center" mt="xs">
          <Badge color={registrationOpen ? "green" : "gray"} variant="light">
            {registrationOpen ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}
          </Badge>
        </Group>
        {registrationOpen && registration_end_date && (
          <Text c="dimmed" ta="center" size="md" mt={4}>
            Sampai {dayjs(registration_end_date).format("D MMMM YYYY")}
          </Text>
        )}
        {short_description && (
          <Text c="dimmed" ta="center" lineClamp={3} mt="xs">
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
                  : `s/d ${dayjs(end_period).format("MMM YYYY")}`}
            </Badge>
          </Group>
        </Card.Section>
      )}

      <Group mt="sm" className={classes.buttonSection}>
        <Button component={Link} href={`/clubs/${id}`} radius="md" fullWidth>
          Lihat Detail
        </Button>
      </Group>
    </Card>
  );
}
