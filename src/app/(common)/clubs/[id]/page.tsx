import DetailBackLink from "@/components/layout/DetailBackLink";
import detailClasses from "@/components/layout/DetailLayout.module.css";
import PageContainer from "@/components/layout/PageContainer";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AspectRatio,
  Badge,
  Card,
  CardSection,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconCalendarEvent } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { getClub } from "@/services/club.cache";
import ClubLogo from "@/components/common/ClubLogo";
import ClubRegistrationInfo from "@/components/common/ClubRegistrationInfo";
import RichTextContent from "@/components/common/RichTextContent";
import {
  ClubRegistrationAction,
  ClubRegistrationActionFallback,
} from "@/components/clubs/ClubRegistrationAction";
import LinkButton from "@/components/common/LinkButton";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";
import { CLUB_TYPE_LABELS, type ClubDetail } from "@/types/model/club";
import classes from "./page.module.css";

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

function isValidClubId(id: string): boolean {
  const parsedId = Number(id);
  return /^\d+$/.test(id) && Number.isSafeInteger(parsedId) && parsedId > 0;
}

export async function generateMetadata({
  params,
}: ClubDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!isValidClubId(id)) {
    return { title: "Halaman tidak ditemukan" };
  }

  try {
    const club = await getClub({ id });
    if (!club) {
      return { title: "Klub" };
    }
    return {
      title: club.name,
      description:
        club.short_description || `Detail ${club.name} di Kaderisasi Salman`,
    };
  } catch {
    return { title: "Klub" };
  }
}

function formatPeriod(club: ClubDetail): string | null {
  if (!club.start_period && !club.end_period) {
    return null;
  }

  const start = club.start_period
    ? dayjs(club.start_period).locale("id").format("MMMM YYYY")
    : "Mulai belum ditentukan";
  const end = club.end_period
    ? dayjs(club.end_period).locale("id").format("MMMM YYYY")
    : "Sekarang";

  return `${start}–${end}`;
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;

  if (!isValidClubId(id)) {
    notFound();
  }

  const club: ClubDetail | null = await getClub({ id });

  if (!club) {
    notFound();
  }

  const registrationOpen = isClubRegistrationOpen({
    isRegistrationOpen: Boolean(club.is_registration_open),
    registrationEndDate: club.registration_end_date,
  });
  const logoUrl = club.logo
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
    : undefined;
  const period = formatPeriod(club);

  return (
    <PageContainer size="md">
      <Stack gap="lg">
        <DetailBackLink href="/clubs">Kembali ke daftar klub</DetailBackLink>

        <div className={detailClasses.header}>
          <Card
            component="header"
            padding="lg"
            radius="md"
            withBorder
            className={detailClasses.identityCard}
          >
            <div className={classes.identityHeader}>
              <ClubLogo
                imageSrc={logoUrl}
                clubName={club.name}
                size={96}
                priority
                className={classes.logo}
              />

              <div className={classes.identity}>
                <Title order={1} size="h2" className={classes.title}>
                  {club.name}
                </Title>
                <Group gap={7} mt="xs">
                  <Badge variant="light">
                    {CLUB_TYPE_LABELS[club.club_type]}
                  </Badge>
                  <Badge
                    variant="light"
                    color={registrationOpen ? "green" : "gray"}
                  >
                    {registrationOpen
                      ? "Pendaftaran dibuka"
                      : "Pendaftaran ditutup"}
                  </Badge>
                </Group>
                {club.short_description && (
                  <Text className={classes.shortDescription}>
                    {club.short_description}
                  </Text>
                )}
              </div>
            </div>

            {(period || club.registration_end_date) && (
              <CardSection className={detailClasses.metadataSection}>
                <Text mt="md" className={detailClasses.label} c="dimmed">
                  Informasi Klub
                </Text>
                <Group gap={7} mt={5}>
                  {period && (
                    <Badge
                      variant="light"
                      leftSection={
                        <IconCalendar size={14} aria-hidden="true" />
                      }
                    >
                      {period}
                    </Badge>
                  )}
                  {club.registration_end_date && (
                    <Badge
                      variant="light"
                      color="red"
                      leftSection={
                        <IconCalendarEvent size={14} aria-hidden="true" />
                      }
                    >
                      Batas pendaftaran{" "}
                      {dayjs(club.registration_end_date)
                        .locale("id")
                        .format("D MMMM YYYY")}
                    </Badge>
                  )}
                </Group>
              </CardSection>
            )}
          </Card>

          <Card
            component="aside"
            padding="lg"
            radius="md"
            withBorder
            className={detailClasses.actionCard}
            aria-label="Tindakan pendaftaran klub"
          >
            <Title order={2} size="h4" ta="center">
              Pendaftaran Klub
            </Title>
            <Suspense fallback={<ClubRegistrationActionFallback />}>
              <ClubRegistrationAction
                clubId={club.id}
                clubName={club.name}
                isRegistrationOpen={registrationOpen}
              />
            </Suspense>
          </Card>
        </div>

        <Stack gap="lg">
          {registrationOpen && (
            <ClubRegistrationInfo
              registrationInfo={club.registration_info}
              presentation="open"
            />
          )}

          {club.description && (
            <Card
              component="section"
              aria-labelledby="about-club-heading"
              withBorder
              radius="md"
              p="lg"
            >
              <Title
                order={2}
                id="about-club-heading"
                className={detailClasses.sectionHeading}
              >
                Tentang Klub
              </Title>
              <RichTextContent html={club.description} />
            </Card>
          )}

          {!registrationOpen && (
            <ClubRegistrationInfo
              registrationInfo={club.registration_info}
              presentation="closed"
            />
          )}

          {!!club.leadership?.length && (
            <Card
              component="section"
              aria-labelledby="club-leadership-heading"
              withBorder
              radius="md"
              p="lg"
            >
              <Title
                order={2}
                id="club-leadership-heading"
                className={detailClasses.sectionHeading}
              >
                Pengurus
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {club.leadership.map((role) => (
                  <Card
                    component="article"
                    key={role.id}
                    withBorder
                    radius="md"
                    className={classes.collectionCard}
                  >
                    <Title order={3} className={classes.itemTitle}>
                      {role.registration?.member?.profile?.name || "Anggota"}
                    </Title>
                    <Text className={classes.secondaryText}>
                      {role.role_name}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Card>
          )}

          {!!club.activities?.length && (
            <Card
              component="section"
              aria-labelledby="club-activities-heading"
              withBorder
              radius="md"
              p="lg"
            >
              <Title
                order={2}
                id="club-activities-heading"
                className={detailClasses.sectionHeading}
              >
                Kegiatan Terkait
              </Title>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                {club.activities.map((activity) => (
                  <Card
                    component="article"
                    key={activity.id}
                    withBorder
                    radius="md"
                    className={classes.collectionCard}
                  >
                    <Stack gap="sm">
                      <div className={classes.activityHeader}>
                        <Title order={3} className={classes.itemTitle}>
                          {activity.name}
                        </Title>
                        <Badge variant="light">
                          {activity.is_registration_open
                            ? "Pendaftaran dibuka"
                            : "Informasi kegiatan"}
                        </Badge>
                      </div>
                      {activity.activity_start && (
                        <Group gap="xs" wrap="nowrap">
                          <IconCalendarEvent size={17} aria-hidden="true" />
                          <Text className={classes.secondaryText}>
                            {dayjs(activity.activity_start)
                              .locale("id")
                              .format("D MMMM YYYY")}
                          </Text>
                        </Group>
                      )}
                      <LinkButton
                        href={`/activity/${activity.slug}`}
                        variant="default"
                        className={classes.itemAction}
                      >
                        Lihat kegiatan
                      </LinkButton>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Card>
          )}

          {!!club.media?.items?.length && (
            <Card
              component="section"
              aria-labelledby="club-media-heading"
              withBorder
              radius="md"
              p="lg"
            >
              <Title
                order={2}
                id="club-media-heading"
                className={detailClasses.sectionHeading}
              >
                Media
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {club.media.items.map((item, index) => {
                  const mediaNumber = index + 1;

                  return (
                    <figure
                      key={`${item.media_type}-${item.media_url}-${index}`}
                      className={classes.mediaItem}
                    >
                      <AspectRatio ratio={16 / 10}>
                        {item.media_type === "image" ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.media_url}`}
                            alt={`Media ${mediaNumber} dari ${club.name}`}
                            width={1600}
                            height={1000}
                            sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
                            className={classes.mediaVisual}
                          />
                        ) : (
                          <iframe
                            src={item.media_url}
                            title={`Video ${mediaNumber} dari ${club.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            className={classes.mediaVisual}
                          />
                        )}
                      </AspectRatio>
                      <figcaption>
                        <Title order={3} className={classes.mediaLabel}>
                          Media {mediaNumber}
                        </Title>
                      </figcaption>
                    </figure>
                  );
                })}
              </SimpleGrid>
            </Card>
          )}
        </Stack>
      </Stack>
    </PageContainer>
  );
}
