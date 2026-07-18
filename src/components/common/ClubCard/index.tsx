import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";
import { Card, Group, Text, Title } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import ClubLogo from "@/components/common/ClubLogo";
import type { ClubType } from "@/types/model/club";
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

  return (
    <Card component="article" withBorder radius="md" className={classes.card}>
      <div className={classes.header}>
        <ClubLogo imageSrc={logoUrl} clubName={name} size={68} />
        <div className={classes.identity}>
          {club_type && <Text className={classes.type}>{club_type}</Text>}
          <Title order={3} className={classes.name}>
            <Link href={`/clubs/${id}`} className={classes.link}>
              {name}
            </Link>
          </Title>
          <Text
            className={classes.registration}
            data-open={registrationOpen || undefined}
          >
            <span className={classes.statusDot} aria-hidden="true" />
            {registrationOpen ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}
          </Text>
        </div>
      </div>

      <Text className={classes.description} lineClamp={2}>
        {short_description || "Informasi singkat klub belum tersedia."}
      </Text>

      {registrationOpen && registration_end_date && (
        <Text className={classes.deadline}>
          Pendaftaran hingga{" "}
          {dayjs(registration_end_date).locale("id").format("D MMMM YYYY")}
        </Text>
      )}

      {period && (
        <Group gap="xs" wrap="nowrap" className={classes.period}>
          <IconCalendar size={17} stroke={1.7} aria-hidden="true" />
          <Text component="span">{period}</Text>
        </Group>
      )}
    </Card>
  );
}
