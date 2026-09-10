import { Suspense } from "react";
import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Anchor, Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconCalendar,
  IconCalendarEvent,
  IconSchool,
} from "@tabler/icons-react";
import RichTextContent from "@/components/common/RichTextContent";
import ActivityPoster from "@/features/activity/ActivityPoster";
import DetailBackLink from "@/components/layout/DetailBackLink";
import PageContainer from "@/components/layout/PageContainer";
import {
  ActivityRegistrationAction,
  ActivityRegistrationActionFallback,
} from "@/features/activity/ActivityRegistrationAction";
import {
  formatActivityDate,
  formatActivityDateRange,
} from "@/features/activity/activity-dates";
import {
  ACTIVITY_CATEGORY_RENDER,
  USER_LEVEL_RENDER,
} from "@/constants/render/activity";
import { getActivityDetail } from "@/services/activity.cache";
import classes from "./index.module.css";

type ActivityDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ActivityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const activity = await getActivityDetail({ slug });
    if (!activity) return { title: "Kegiatan tidak ditemukan" };
    const description = `${activity.name} - Ayo daftar kegiatan ini di Kaderisasi Salman`;
    const image = activity.additional_config?.images?.[0];
    const imageUrl = image
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${image}`
      : undefined;
    return {
      title: activity.name,
      description,
      openGraph: {
        title: activity.name,
        description,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/activity/${slug}`,
        type: "website",
        images: imageUrl ? [{ url: imageUrl, alt: activity.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: activity.name,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Kegiatan" };
  }
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const activity = await getActivityDetail({ slug });
  if (!activity) notFound();
  const images = activity.additional_config?.images ?? [];
  const sections = [
    ...(images.length
      ? [{ href: "#activity-poster", label: "Poster kegiatan" }]
      : []),
    { href: "#activity-registration", label: "Pendaftaran" },
    { href: "#about-activity", label: "Tentang kegiatan" },
  ];

  return (
    <PageContainer size="md">
      <Stack gap="lg">
        <DetailBackLink href="/activity">
          Kembali ke daftar kegiatan
        </DetailBackLink>
        <Paper
          component="header"
          withBorder
          radius="md"
          className={classes.header}
        >
          <Badge variant="light" className={classes.badge}>
            {ACTIVITY_CATEGORY_RENDER[activity.activity_category]}
          </Badge>
          <Title order={1} size="h2" mt="xs" className={classes.title}>
            {activity.name}
          </Title>
          <Group
            gap="xs"
            wrap="nowrap"
            mt="md"
            align="flex-start"
            className={classes.schedule}
          >
            <IconCalendarEvent size={20} aria-hidden="true" />
            <div>
              <Text size="sm" c="dimmed">
                Pelaksanaan kegiatan
              </Text>
              <Text fw={600}>
                {formatActivityDateRange(
                  activity.activity_start,
                  activity.activity_end,
                )}
              </Text>
            </div>
          </Group>
        </Paper>

        <Group
          component="nav"
          aria-label="Bagian halaman kegiatan"
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

        <div
          className={classes.overview}
          data-has-poster={images.length > 0 || undefined}
        >
          {images.length ? (
            <section
              id="activity-poster"
              aria-label="Poster kegiatan"
              className={classes.posterSection}
            >
              <ActivityPoster
                key={activity.slug}
                images={images}
                activityName={activity.name}
                imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ""}
              />
            </section>
          ) : null}
          <Paper
            component="aside"
            id="activity-registration"
            aria-labelledby="activity-registration-heading"
            withBorder
            radius="md"
            className={classes.registrationCard}
          >
            <Title order={2} size="h3" id="activity-registration-heading">
              Pendaftaran
            </Title>
            <Badge
              variant="light"
              color={activity.is_registration_open ? "green" : "gray"}
              mt="sm"
              mb="lg"
              className={classes.badge}
            >
              {activity.is_registration_open
                ? "Pendaftaran dibuka"
                : "Pendaftaran ditutup"}
            </Badge>
            <Stack
              component="dl"
              gap="md"
              className={classes.registrationFacts}
            >
              {activity.registration_start ? (
                <div>
                  <Text component="dt" size="sm" c="dimmed">
                    <IconCalendar size={16} aria-hidden="true" />
                    Mulai pendaftaran
                  </Text>
                  <Text component="dd" fw={600}>
                    {formatActivityDate(activity.registration_start)}
                  </Text>
                </div>
              ) : null}
              <div>
                <Text component="dt" size="sm" c="dimmed">
                  <IconCalendarEvent size={16} aria-hidden="true" />
                  Batas pendaftaran
                </Text>
                <Text component="dd" fw={600}>
                  {formatActivityDate(activity.registration_end)}
                </Text>
              </div>
              <div>
                <Text component="dt" size="sm" c="dimmed">
                  <IconSchool size={16} aria-hidden="true" />
                  Jenjang minimum
                </Text>
                <Text component="dd" fw={600}>
                  {USER_LEVEL_RENDER[activity.minimum_level]}
                </Text>
              </div>
            </Stack>
            <Suspense fallback={<ActivityRegistrationActionFallback />}>
              <ActivityRegistrationAction activity={activity} />
            </Suspense>
          </Paper>

          <Paper
            component="section"
            id="about-activity"
            aria-labelledby="about-activity-heading"
            withBorder
            radius="md"
            className={classes.contentSection}
          >
            <Title order={2} size="h3" id="about-activity-heading" mb="md">
              Tentang kegiatan
            </Title>
            {activity.description?.trim() ? (
              <RichTextContent html={activity.description} />
            ) : (
              <Text c="dimmed">Deskripsi kegiatan belum tersedia.</Text>
            )}
          </Paper>
        </div>
      </Stack>
    </PageContainer>
  );
}
