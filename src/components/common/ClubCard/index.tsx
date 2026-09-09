import type { ReactElement } from "react";
import CatalogueCard, {
  CatalogueCardSection,
} from "@/components/common/Catalogue/CatalogueCard";
import CatalogueImage from "@/components/common/Catalogue/CatalogueImage";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Badge } from "@mantine/core";
import {
  IconCalendar,
  IconCalendarTime,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CLUB_TYPE_LABELS, type ClubType } from "@/types/model/club";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";

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
}: ClubCardProps): ReactElement {
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
    <CatalogueCard
      title={name}
      href={`/clubs/${id}`}
      linkLabel={`Lihat klub ${name}`}
      media={
        <CatalogueImage
          src={logoUrl}
          alt={`Logo ${name}`}
          variant="logo"
          fallback={<IconUsersGroup size={48} stroke={1.5} aria-hidden />}
        />
      }
    >
      <CatalogueCardSection label="Pendaftaran">
        <Badge color={registrationOpen ? "green" : "gray"} variant="light">
          {registrationOpen ? "Dibuka" : "Ditutup"}
        </Badge>
        {registrationOpen && registration_end_date && (
          <Badge
            color="red"
            variant="light"
            leftSection={<IconCalendarTime size={14} aria-hidden />}
          >
            {dayjs(registration_end_date).locale("id").format("D MMMM YYYY")}
          </Badge>
        )}
      </CatalogueCardSection>
      <CatalogueCardSection label="Jenis & Periode">
        {club_type && (
          <Badge color={CLUB_TYPE_COLORS[club_type]} variant="light">
            {CLUB_TYPE_LABELS[club_type]}
          </Badge>
        )}
        {period && (
          <Badge
            variant="light"
            leftSection={<IconCalendar size={14} aria-hidden />}
          >
            {period}
          </Badge>
        )}
      </CatalogueCardSection>
    </CatalogueCard>
  );
}
