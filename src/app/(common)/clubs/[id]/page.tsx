import { Suspense } from "react";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import {
  Anchor,
  Badge,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconCalendarEvent } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import DetailBackLink from "@/components/layout/DetailBackLink";
import detailClasses from "@/components/layout/DetailLayout.module.css";
import PageContainer from "@/components/layout/PageContainer";
import ClubLogo from "@/components/common/ClubLogo";
import ClubRegistrationInfo from "@/components/common/ClubRegistrationInfo";
import RichTextContent from "@/components/common/RichTextContent";
import MediaGallery from "@/components/common/MediaGallery";
import {
  ClubRegistrationAction,
  ClubRegistrationActionFallback,
} from "@/components/clubs/ClubRegistrationAction";
import LinkButton from "@/components/common/LinkButton";
import { getClub } from "@/services/club.cache";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";
import { CLUB_TYPE_LABELS, type ClubDetail } from "@/types/model/club";
import classes from "./page.module.css";

type ClubDetailPageProps = { params: Promise<{ id: string }> };

function isValidClubId(id: string): boolean {
  const parsedId = Number(id);
  return /^\d+$/.test(id) && Number.isSafeInteger(parsedId) && parsedId > 0;
}

export async function generateMetadata({
  params,
}: ClubDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!isValidClubId(id)) return { title: "Halaman tidak ditemukan" };
  try {
    const club = await getClub({ id });
    if (!club) return { title: "Klub" };
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
  if (!club.start_period && !club.end_period) return null;
  const start = club.start_period
    ? dayjs(club.start_period).locale("id").format("MMMM YYYY")
    : "Mulai belum ditentukan";
  const end = club.end_period
    ? dayjs(club.end_period).locale("id").format("MMMM YYYY")
    : "Sekarang";
  return `${start}–${end}`;
}

export default async function ClubDetailPage({
  params,
}: ClubDetailPageProps): Promise<ReactElement> {
  const { id } = await params;
  if (!isValidClubId(id)) notFound();
  const club = await getClub({ id });
  if (!club) notFound();

  // Registration deadlines must be evaluated for the current request.
  await connection();
  const registrationOpen = isClubRegistrationOpen({
    isRegistrationOpen: Boolean(club.is_registration_open),
    registrationEndDate: club.registration_end_date,
  });
  const logoUrl = club.logo
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
    : undefined;
  const period = formatPeriod(club);
  const sections = [
    { href: "#about-club", label: "Tentang klub" },
    { href: "#club-registration", label: "Pendaftaran" },
    ...(club.leadership?.length
      ? [{ href: "#club-leadership", label: "Pengurus" }]
      : []),
    ...(club.activities?.length
      ? [{ href: "#club-activities", label: "Kegiatan" }]
      : []),
    ...(club.media?.items?.length
      ? [{ href: "#club-media", label: "Galeri" }]
      : []),
  ];

  return (
    <PageContainer size="md">
      <Stack gap="lg">
        <DetailBackLink href="/clubs">Kembali ke daftar klub</DetailBackLink>
        <Paper
          component="header"
          radius="md"
          withBorder
          className={classes.profileHeader}
        >
          <div className={classes.identityHeader}>
            <ClubLogo
              imageSrc={logoUrl}
              clubName={club.name}
              size={112}
              priority
              className={classes.logo}
            />
            <div className={classes.identity}>
              <Badge variant="light" className={classes.typeBadge}>
                {CLUB_TYPE_LABELS[club.club_type]}
              </Badge>
              <Title order={1} size="h2" className={classes.title}>
                {club.name}
              </Title>
              {club.short_description ? (
                <Text className={classes.shortDescription}>
                  {club.short_description}
                </Text>
              ) : null}
            </div>
          </div>
        </Paper>

        <Group
          component="nav"
          aria-label="Bagian halaman klub"
          gap={4}
          className={classes.sectionNav}
        >
          {sections.map((section) => (
            <Anchor
              key={section.href}
              href={section.href}
              underline="never"
              className={classes.sectionLink}
            >
              {section.label}
            </Anchor>
          ))}
        </Group>

        <div className={classes.overview}>
          <Paper
            component="aside"
            id="club-registration"
            radius="md"
            withBorder
            className={classes.registrationCard}
            aria-labelledby="club-registration-heading"
          >
            <Title
              order={2}
              id="club-registration-heading"
              className={classes.sectionTitle}
            >
              Pendaftaran
            </Title>
            <Badge
              variant="light"
              color={registrationOpen ? "green" : "gray"}
              className={classes.statusBadge}
            >
              {registrationOpen ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}
            </Badge>
            {period || club.registration_end_date ? (
              <Stack
                component="dl"
                gap="md"
                className={classes.registrationFacts}
              >
                {period ? (
                  <div>
                    <Text component="dt" size="sm" c="dimmed">
                      <IconCalendar size={16} aria-hidden="true" /> Periode klub
                    </Text>
                    <Text component="dd" fw={600}>
                      {period}
                    </Text>
                  </div>
                ) : null}
                {club.registration_end_date ? (
                  <div>
                    <Text component="dt" size="sm" c="dimmed">
                      <IconCalendarEvent size={16} aria-hidden="true" />
                      {registrationOpen
                        ? "Batas pendaftaran"
                        : "Pendaftaran berakhir"}
                    </Text>
                    <Text component="dd" fw={600}>
                      <time dateTime={club.registration_end_date}>
                        {dayjs(club.registration_end_date)
                          .locale("id")
                          .format("D MMMM YYYY")}
                      </time>
                    </Text>
                  </div>
                ) : null}
              </Stack>
            ) : null}
            <Suspense fallback={<ClubRegistrationActionFallback />}>
              <ClubRegistrationAction
                clubId={club.id}
                clubName={club.name}
                isRegistrationOpen={registrationOpen}
              />
            </Suspense>
          </Paper>

          <Stack gap="lg" className={classes.overviewContent}>
            <Paper
              component="section"
              id="about-club"
              aria-labelledby="about-club-heading"
              withBorder
              radius="md"
              className={classes.contentSection}
            >
              <Title
                order={2}
                id="about-club-heading"
                className={detailClasses.sectionHeading}
              >
                Tentang klub
              </Title>
              {club.description?.trim() ? (
                <RichTextContent html={club.description} />
              ) : (
                <Text c="dimmed">Deskripsi klub belum tersedia.</Text>
              )}
            </Paper>
            <ClubRegistrationInfo
              registrationInfo={club.registration_info}
              presentation={registrationOpen ? "open" : "closed"}
            />
          </Stack>
        </div>

        {club.leadership?.length ? (
          <Paper
            component="section"
            id="club-leadership"
            aria-labelledby="club-leadership-heading"
            withBorder
            radius="md"
            className={classes.contentSection}
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
                <Paper
                  component="article"
                  key={role.id}
                  radius="md"
                  className={classes.leadershipItem}
                >
                  <Title order={3} className={classes.itemTitle}>
                    {role.registration?.member?.profile?.name || "Anggota"}
                  </Title>
                  <Text className={classes.secondaryText}>
                    {role.role_name}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>
        ) : null}

        {club.activities?.length ? (
          <Paper
            component="section"
            id="club-activities"
            aria-labelledby="club-activities-heading"
            withBorder
            radius="md"
            className={classes.contentSection}
          >
            <Title
              order={2}
              id="club-activities-heading"
              className={detailClasses.sectionHeading}
            >
              Kegiatan terkait
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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
                    {activity.activity_start ? (
                      <Group gap="xs" wrap="nowrap">
                        <IconCalendarEvent size={17} aria-hidden="true" />
                        <Text className={classes.secondaryText}>
                          {dayjs(activity.activity_start)
                            .locale("id")
                            .format("D MMMM YYYY")}
                        </Text>
                      </Group>
                    ) : null}
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
          </Paper>
        ) : null}

        {club.media?.items?.length ? (
          <Paper
            component="section"
            id="club-media"
            aria-labelledby="club-media-heading"
            withBorder
            radius="md"
            className={classes.contentSection}
          >
            <Title
              order={2}
              id="club-media-heading"
              className={classes.sectionTitle}
            >
              Galeri klub
            </Title>
            <Text c="dimmed" mt="xs" mb="lg">
              {club.media.items.some((item) => item.media_type === "image")
                ? "Pilih gambar untuk melihat ukuran penuh."
                : "Video dari klub."}
            </Text>
              <MediaGallery
              items={club.media.items}
                subjectName={club.name}
              imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}
            />
          </Paper>
        ) : null}
      </Stack>
    </PageContainer>
  );
}
