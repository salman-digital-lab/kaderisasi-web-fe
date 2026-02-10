import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  rem,
  Stack,
  Title,
  Text,
  CardSection,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconCalendarMonth,
  IconArrowLeft,
  IconArrowRight,
  IconClock,
} from "@tabler/icons-react";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import Link from "next/link";

import classes from "./index.module.css";
import {
  ACTIVITY_CATEGORY_RENDER,
  ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER,
  USER_LEVEL_RENDER,
} from "../../../../constants/render/activity";
import { verifySession } from "../../../../functions/server/session";
import {
  getActivity,
  getActivityRegistration,
} from "../../../../services/activity";
import { getProfile } from "../../../../services/profile";
import { getCustomFormByFeature } from "../../../../services/customForm";
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
      }
    | undefined;

  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  let activity: Activity | undefined;
  let hasCustomForm = false;

  const sessionData = await verifySession();

  try {
    activity = await getActivity(params);
    profileData = await getProfile(sessionData.session || "");
    if (sessionData.session) {
      activityRegistration = await getActivityRegistration(
        sessionData.session,
        params,
      );
    }

    // Check if activity has a custom form
    if (activity?.id) {
      try {
        const customForm = await getCustomFormByFeature({
          feature_type: "activity_registration",
          feature_id: activity.id,
        });
        hasCustomForm = !!customForm && customForm.is_active;
      } catch {
        // No custom form found, use default flow
        hasCustomForm = false;
      }
    }
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
        <Carousel
          classNames={{
            control: classes["carousel-control"],
            indicator: classes["carousel-indicator"],
            slide: classes["carousel-slide"],
          }}
          slideGap="md"
          withIndicators
          controlsOffset={0}
          controlSize={40}
          emblaOptions={{ loop: true, align: "start" }}
          nextControlIcon={<IconArrowRight size={24} color="white" />}
          previousControlIcon={<IconArrowLeft size={24} color="white" />}
          withControls={
            activity?.additional_config?.images &&
            activity?.additional_config?.images?.length > 1
          }
        >
          {activity?.additional_config?.images?.length ? (
            activity?.additional_config.images?.map((image) => (
              <CarouselSlide key={image}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${image}`}
                  alt="Activity Banner"
                  className={classes["carousel-image"]}
                  fallbackSrc={
                    "https://placehold.co/700x700?text=" + activity?.name
                  }
                />
              </CarouselSlide>
            ))
          ) : (
            <CarouselSlide>
              <Image
                src={"https://placehold.co/700x700?text=" + activity?.name}
                alt="Activity Banner"
                className={classes["carousel-image"]}
              />
            </CarouselSlide>
          )}
        </Carousel>
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
            </Stack>
          ) : (
            <Stack gap="xs">
              <Title order={5} ta="center">
                {dayjs().isAfter(activity?.registration_end)
                  ? "Cek Status Pendaftaran"
                  : "Tutup Pendaftaran"}
              </Title>
              {dayjs().isAfter(activity?.registration_end) ? null : (
                <Badge m="auto" color="red" leftSection={calendarIcon}>
                  {dayjs(activity?.registration_end)
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
                  href={
                    hasCustomForm
                      ? `/custom-form/activity/${activity?.id}`
                      : `/activity/register/${params.slug}/profile-data`
                  }
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
                  href={
                    dayjs().isAfter(activity?.registration_end)
                      ? `/login?redirect=${process.env.NEXT_PUBLIC_APP_URL}/activity/${params.slug}`
                      : `/login?redirect=${
                          process.env.NEXT_PUBLIC_APP_URL
                        }${`/custom-form/activity/${activity?.id}`}`
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Button fullWidth>
                    {dayjs().isAfter(activity?.registration_end)
                      ? "Masuk"
                      : "Daftar Kegiatan"}
                  </Button>
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
