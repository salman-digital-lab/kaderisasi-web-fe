import dayjs from "dayjs";
import "dayjs/locale/id";
import { Badge } from "@mantine/core";
import { IconCalendarTime, IconCalendarEvent } from "@tabler/icons-react";
import type { ReactElement } from "react";
import CatalogueCard, {
  CatalogueCardSection,
} from "@/components/common/Catalogue/CatalogueCard";
import CatalogueImage from "@/components/common/Catalogue/CatalogueImage";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import type { USER_LEVEL_ENUM } from "@/types/constants/profile";

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
}: ActivityCardProps): ReactElement {
  return (
    <CatalogueCard
      title={activityName}
      href={`/activity/${slug}`}
      linkLabel={`Lihat kegiatan ${activityName}`}
      media={
        <CatalogueImage
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : undefined
          }
          alt={activityName}
          variant="poster"
          fallback={<IconCalendarEvent size={48} stroke={1.5} aria-hidden />}
        />
      }
    >
      <CatalogueCardSection label="Tutup Pendaftaran">
        <Badge
          variant="light"
          color="red"
          leftSection={<IconCalendarTime size={14} aria-hidden />}
        >
          {dayjs(registrationEnd).locale("id").format("D MMMM YYYY")}
        </Badge>
      </CatalogueCardSection>
      <CatalogueCardSection label="Jenjang Minimum">
        <Badge variant="light">{USER_LEVEL_RENDER[minimumLevel]}</Badge>
      </CatalogueCardSection>
    </CatalogueCard>
  );
}
