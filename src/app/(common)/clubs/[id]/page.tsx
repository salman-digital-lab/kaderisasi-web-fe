import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AspectRatio,
  Badge,
  Card,
  CardSection,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { getClub } from "@/services/club.cache";
import ClubLogo from "@/components/common/ClubLogo";
import ClubRegistrationInfo from "@/components/common/ClubRegistrationInfo";
import ClubRichText from "@/components/common/ClubRichText";
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

export async function generateMetadata({ params }: ClubDetailPageProps) {
  const { id } = await params;

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
  const parsedId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(parsedId) || parsedId <= 0) {
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
    <Container size="md" py={{ base: "md", md: "xl" }}>
      <Stack gap="md">
        <Link href="/clubs" className={classes.backLink}>
          <IconArrowLeft size={18} aria-hidden="true" />
          Kembali ke daftar klub
        </Link>

        <div className={classes.header}>
          <Card
            component="header"
            padding="lg"
            radius="md"
            withBorder
            className={classes.identityCard}
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
                <Group gap={7}>
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
                <Title order={1} size="h2" className={classes.title}>
                  {club.name}
                </Title>
                {club.short_description && (
                  <Text className={classes.shortDescription}>
                    {club.short_description}
                  </Text>
                )}
              </div>
            </div>

            {(period || club.registration_end_date) && (
              <CardSection className={classes.metadataSection}>
                <Text mt="md" className={classes.label} c="dimmed">
                  Informasi Klub
                </Text>
                <Group gap={7} mt={5}>
                  {period && (
                    <Badge
                      variant="light"
                      leftSection={
                        <IconCalendar size={14} aria-hidden="true" />
                      }
                      className={classes.metadataBadge}
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
                      className={classes.metadataBadge}
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
            className={classes.actionCard}
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

        <Stack className={classes.body}>
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
                className={classes.heading}
              >
                Tentang Klub
              </Title>
              <ClubRichText html={club.description} />
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
                className={classes.heading}
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
                className={classes.heading}
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
                className={classes.heading}
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
    </Container>
  );
}
