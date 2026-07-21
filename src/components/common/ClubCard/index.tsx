import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardSection,
  Group,
  rem,
  Text,
} from "@mantine/core";
import { IconCalendar, IconCalendarTime } from "@tabler/icons-react";
import ClubLogo from "@/components/common/ClubLogo";
import { CLUB_TYPE_LABELS, type ClubType } from "@/types/model/club";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";
import classes from "./index.module.css";

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

const CLUB_TYPE_COLORS: Record<ClubType, string> = {
  UNIT: "blue",
  CLUB_KEPROFESIAN: "grape",
  CLUB_BAHASA: "teal",
  AVISMAN_REGIONAL: "violet",
};

export default function ClubCard({
  id,
  name,
  club_type,
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
  const logoUrl = logo
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${logo}`
    : undefined;
  const period =
    start_period || end_period
      ? start_period && end_period
        ? `${dayjs(start_period).locale("id").format("MMM YYYY")}–${dayjs(end_period).locale("id").format("MMM YYYY")}`
        : start_period
          ? `Mulai ${dayjs(start_period).locale("id").format("MMM YYYY")}`
          : `Hingga ${dayjs(end_period).locale("id").format("MMM YYYY")}`
      : null;
  const registrationIcon = (
    <IconCalendarTime
      style={{ width: rem(14), height: rem(14) }}
      aria-hidden="true"
    />
  );
  const periodIcon = (
    <IconCalendar
      style={{ width: rem(14), height: rem(14) }}
      aria-hidden="true"
    />
  );

  return (
    <Card
      component="article"
      withBorder
      radius="md"
      p="md"
      className={classes.card}
    >
      <CardSection className={classes.logoSection}>
        <ClubLogo imageSrc={logoUrl} clubName={name} size={112} />
      </CardSection>

      <CardSection className={classes.section} mt="sm" flex="1">
        <Text fz="md" fw={600} lineClamp={3}>
          {name}
        </Text>
      </CardSection>

      <CardSection className={classes.section}>
        <Text mt="sm" className={classes.label} c="dimmed">
          Pendaftaran
        </Text>
        <Group gap={7} mt={5}>
          <Badge color={registrationOpen ? "green" : "gray"} variant="light">
            {registrationOpen ? "Dibuka" : "Ditutup"}
          </Badge>
          {registrationOpen && registration_end_date && (
            <Badge color="red" variant="light" leftSection={registrationIcon}>
              {dayjs(registration_end_date).locale("id").format("D MMMM YYYY")}
            </Badge>
          )}
        </Group>
      </CardSection>

      <CardSection className={classes.section}>
        <Text mt="sm" className={classes.label} c="dimmed">
          Jenis &amp; Periode
        </Text>
        <Group gap={7} mt={5}>
          {club_type && (
            <Badge color={CLUB_TYPE_COLORS[club_type]} variant="light">
              {CLUB_TYPE_LABELS[club_type]}
            </Badge>
          )}
          {period && (
            <Badge variant="light" color="blue" leftSection={periodIcon}>
              {period}
            </Badge>
          )}
        </Group>
      </CardSection>

      <Group mt="sm">
        <Link href={`/clubs/${id}`} style={{ flex: 1, textDecoration: "none" }}>
          <Button radius="md" fullWidth>
            Lihat Selengkapnya
          </Button>
        </Link>
      </Group>
    </Card>
  );
}
