import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  rem,
  Skeleton,
  Stack,
  Title,
  Text,
  CardSection,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconCalendarMonth,
  IconClock,
  IconCertificate,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ActivityCarousel = dynamic(() => import("./ActivityCarousel"), {
  loading: () => <Skeleton height={700} radius="md" />,
});

import classes from "./index.module.css";
import {
  ACTIVITY_CATEGORY_RENDER,
  ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER,
  USER_LEVEL_RENDER,
} from "../../../../constants/render/activity";
import { verifySession } from "../../../../functions/server/session";
import { getActivity } from "../../../../services/activity.cache";
import { preloadActivity } from "../../../../services/activity.preload";
import { getActivityRegistration } from "../../../../services/activity";
import { getProfile } from "../../../../services/profile";
import ErrorWrapper from "../../../../components/layout/Error";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import { Activity } from "@/types/model/activity";
import { PublicUser, Member } from "@/types/model/members";
import dayjs from "dayjs";
import "dayjs/locale/id";

const calendarIcon = (
  <IconCalendarTime style={{ width: rem(12), height: rem(12) }} />
);

const calenderMonthIcon = (
  <IconCalendarMonth style={{ width: rem(12), height: rem(12) }} />
);

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const param = await props.params;
  preloadActivity(param);

  const activity = await getActivity(param);
  const activityDescription = `${activity?.name} - Ayo daftar kegiatan ini di Kaderisasi Salman`;
  const activityImage = activity?.additional_config?.images?.length
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${activity.additional_config.images[0]}`
    : undefined;

  return {
    title: activity?.name,
    description: activityDescription,
    openGraph: {
      title: activity?.name,
      description: activityDescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/activity/${param.slug}`,
      type: "website",
      images: activityImage
        ? [
            {
              url: activityImage,
              width: 800,
              height: 800,
              alt: activity?.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: activity?.name,
      description: activityDescription,
      images: activityImage ? [activityImage] : undefined,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  let activityRegistration:
    | {
        status: string;
        visible_at?: string;
        registration_id?: number;
      }
    | undefined;

  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  let activity: Activity | undefined;
  const sessionData = await verifySession();

  try {
    // getActivity is a near-instant cache hit (preloaded in generateMetadata)
    activity = await getActivity(params);

    // Run all remaining fetches in parallel now that we have activity.id
    const [profileResult, activityRegistrationResult] = await Promise.all([
      getProfile(sessionData.session || ""),
      sessionData.session
        ? getActivityRegistration(sessionData.session, params)
        : Promise.resolve(undefined),
    ]);
    profileData = profileResult;
    activityRegistration = activityRegistrationResult;
  } catch (error: unknown) {
    if (typeof error === "string" && error !== "Unauthorized")
      return <ErrorWrapper message={error} />;
  }

  const isRegistered =
    !!activityRegistration?.status &&
    activityRegistration?.status !==
      ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_TERDAFTAR;

  const isLevelEligible = Boolean(
    activity &&
    profileData?.profile?.level !== undefined &&
    profileData?.profile?.level >= activity.minimum_level,
  );

  return (
    <Stack component="main" className={classes["main-stack"]}>
      <Container size="xs" className={classes["carousel-container"]}>
        <ActivityCarousel
          images={activity?.additional_config?.images ?? []}
          activityName={activity?.name ?? ""}
          imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ""}
        />
      </Container>
      <Container size="md" className={classes.header}>
        <Card className={classes.title} padding="lg" radius="md" withBorder>
          <Title order={1} size="h2">
            {activity?.name}
          </Title>
          <Group gap={7} mt={10}>
            <Badge variant="light">
              {activity ? USER_LEVEL_RENDER[activity.minimum_level] : ""}
            </Badge>
            <Badge variant="light">
              {activity
                ? ACTIVITY_CATEGORY_RENDER[activity.activity_category]
                : ""}
            </Badge>
          </Group>
          {activity?.activity_start && (
            <CardSection className={classes.section}>
              <Text mt="md" className={classes.label} c="dimmed">
                Tanggal Mulai Kegiatan
              </Text>
              <Badge variant="light" leftSection={calenderMonthIcon}>
                {dayjs(activity?.activity_start)
                  .locale("id")
                  .format("DD MMMM YYYY")}
              </Badge>
            </CardSection>
          )}
        </Card>
        <Card className={classes.control} padding="lg" radius="md" withBorder>
          {isRegistered ? (
            <Stack gap="xs">
              <Title order={5} ta="center">
                Status Pendaftaran
              </Title>
              <Badge
                color={
                  activityRegistration?.status &&
                  ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER[
                    activityRegistration.status as keyof typeof ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER
                  ]
                    ? ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER[
                        activityRegistration.status as keyof typeof ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER
                      ]
                    : "blue"
                }
                m="auto"
                size="lg"
                px="xl"
              >
                {activityRegistration?.status}
              </Badge>
              {activityRegistration?.status ===
                ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN &&
                activityRegistration?.visible_at && (
                  <Group gap={6} justify="center" mt="xs">
                    <IconClock
                      size={14}
                      color="var(--mantine-color-orange-6)"
                    />
                    <Text size="xs" c="orange.6" fw={500}>
                      Estimasi pengumuman:{" "}
                      {dayjs(activityRegistration.visible_at)
                        .locale("id")
                        .format("DD MMMM YYYY, HH:mm")}
                    </Text>
                  </Group>
                )}
              {activityRegistration?.status ===
                ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN &&
                activityRegistration?.registration_id && (
                  <Link
                    href={`/certificate/${activityRegistration.registration_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      fullWidth
                      color="green"
                      leftSection={<IconCertificate size={16} />}
                    >
                      Lihat Sertifikat
                    </Button>
                  </Link>
                )}
            </Stack>
          ) : sessionData.session ? (
            // Logged in but not registered — registration is closed
            <Stack gap="xs">
              <Title order={5} ta="center">
                {dayjs().isAfter(activity?.registration_end)
                  ? "Cek Status Pendaftaran"
                  : "Tutup Pendaftaran"}
              </Title>
              {!dayjs().isAfter(activity?.registration_end) && (
                <Badge m="auto" color="red" leftSection={calendarIcon}>
                  {dayjs(activity?.registration_end)
                    .locale("id")
                    .format("DD MMMM YYYY")}
                </Badge>
              )}
            </Stack>
          ) : (
            // Not logged in — show registration end date; never show "Cek Status Pendaftaran"
            // since unauthenticated users have no registration status to check
            <Stack gap="xs">
              <Title order={5} ta="center">
                Tutup Pendaftaran
              </Title>
              {activity?.registration_end && (
                <Badge m="auto" color="red" leftSection={calendarIcon}>
                  {dayjs(activity.registration_end)
                    .locale("id")
                    .format("DD MMMM YYYY")}
                </Badge>
              )}
            </Stack>
          )}

          {sessionData.session ? (
            !isRegistered ? (
              !isLevelEligible ? (
                <Button disabled fullWidth>
                  Jenjang Tidak Cukup
                </Button>
              ) : activity?.is_registration_open ? (
                <Link
                  href={`/custom-form/activity/${activity?.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button fullWidth>Daftar Kegiatan</Button>
                </Link>
              ) : null
            ) : null
          ) : (
            <Stack gap="xs">
              {activity?.is_registration_open ? (
                <Link
                  href={`/activity/${params.slug}/join`}
                  style={{ textDecoration: "none" }}
                >
                  <Button fullWidth>Daftar Kegiatan</Button>
                </Link>
              ) : null}
            </Stack>
          )}
        </Card>
      </Container>
      <Container w="100%">
        <Card withBorder radius="md">
          <Title order={2} ta="center" mt="sm">
            Deskripsi Kegiatan
          </Title>
          <div
            dangerouslySetInnerHTML={{ __html: activity?.description || "" }}
          />
        </Card>
      </Container>
    </Stack>
  );
}
