import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AspectRatio,
  Badge,
  Card,
  Container,
  Divider,
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
import type { ClubDetail } from "@/types/model/club";
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
    <Container size="lg" py={{ base: "md", md: "xl" }}>
      <Link href="/clubs" className={classes.backLink}>
        <IconArrowLeft size={18} aria-hidden="true" />
        Kembali ke daftar klub
      </Link>

      <header className={classes.header}>
        <ClubLogo
          imageSrc={logoUrl}
          clubName={club.name}
          size={96}
          priority
          className={classes.logo}
        />

        <div className={classes.identity}>
          <Text className={classes.clubType}>{club.club_type}</Text>
          <Title order={1} className={classes.title}>
            {club.name}
          </Title>
          {club.short_description && (
            <Text className={classes.shortDescription}>
              {club.short_description}
            </Text>
          )}
        </div>

        <div className={classes.metadata}>
          <Text
            className={classes.registrationStatus}
            data-open={registrationOpen || undefined}
          >
            <span className={classes.statusDot} aria-hidden="true" />
            {registrationOpen ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}
          </Text>
          {period && (
            <Group gap="xs" wrap="nowrap" className={classes.metaItem}>
              <IconCalendar size={18} aria-hidden="true" />
              <Text component="span">{period}</Text>
            </Group>
          )}
          {club.registration_end_date && (
            <Group gap="xs" wrap="nowrap" className={classes.metaItem}>
              <IconCalendarEvent size={18} aria-hidden="true" />
              <Text component="span">
                Batas pendaftaran{" "}
                {dayjs(club.registration_end_date)
                  .locale("id")
                  .format("D MMMM YYYY")}
              </Text>
            </Group>
          )}
        </div>

        <aside
          className={classes.actionPanel}
          aria-label="Tindakan pendaftaran klub"
        >
          <Suspense fallback={<ClubRegistrationActionFallback />}>
            <ClubRegistrationAction
              clubId={club.id}
              clubName={club.name}
              isRegistrationOpen={registrationOpen}
            />
          </Suspense>
        </aside>
      </header>

      <Stack className={classes.body}>
        {registrationOpen && (
          <ClubRegistrationInfo
            registrationInfo={club.registration_info}
            presentation="open"
          />
        )}

        {club.description && (
          <section aria-labelledby="about-club-heading">
            <Title
              order={2}
              id="about-club-heading"
              className={classes.heading}
            >
              Tentang Klub
            </Title>
            <ClubRichText html={club.description} />
          </section>
        )}

        {!registrationOpen && (
          <ClubRegistrationInfo
            registrationInfo={club.registration_info}
            presentation="closed"
          />
        )}

        {!!club.leadership?.length && (
          <>
            <Divider />
            <section aria-labelledby="club-leadership-heading">
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
            </section>
          </>
        )}

        {!!club.activities?.length && (
          <>
            <Divider />
            <section aria-labelledby="club-activities-heading">
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
            </section>
          </>
        )}

        {!!club.media?.items?.length && (
          <>
            <Divider />
            <section aria-labelledby="club-media-heading">
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
            </section>
          </>
        )}

        <Link href="/clubs" className={classes.bottomBackLink}>
          <IconArrowLeft size={17} aria-hidden="true" />
          Kembali ke daftar klub
        </Link>
      </Stack>
    </Container>
  );
}
