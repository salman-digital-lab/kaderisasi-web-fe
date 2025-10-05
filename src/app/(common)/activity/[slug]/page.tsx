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
  return {
    title: activity?.name,
    openGraph: {
      title: activity?.name,
      description: `${activity?.name} - Ayo daftar kegiatan ini di Kaderisasi Salman`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/activity/${param.slug}`,
      type: "website",
      images: activity?.additional_config?.images?.length
        ? [
            {
              url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${activity.additional_config.images[0]}`,
              width: 800,
              height: 800,
              alt: activity?.name,
            },
          ]
        : undefined,
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
    <Stack component="main" mt="xl">
      <Container size="xs">
        <Carousel
          classNames={{
            control: classes["carousel-control"],
            indicator: classes["carousel-indicator"],
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
                  h={700}
                  fit="contain"
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
                h={700}
                fit="contain"
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
            </Stack>
          ) : (
            <Stack gap="xs">
              <Title order={5} ta="center">
                Tutup Pendaftaran
              </Title>
              <Badge m="auto" color="red" leftSection={calendarIcon}>
                {dayjs(activity?.registration_end)
                  .locale("id")
                  .format("DD MMMM YYYY")}
              </Badge>
            </Stack>
          )}

          {sessionData.session ? (
            !isRegistered ? (
              !isLevelEligible ? (
                <Button disabled>Jenjang Tidak Cukup</Button>
              ) : (
                <Button
                  component={Link}
                  href={
                    hasCustomForm
                      ? `/custom-form/activity/${activity?.id}`
                      : `/activity/register/${params.slug}/profile-data`
                  }
                >
                  Daftar Kegiatan
                </Button>
              )
            ) : null
          ) : (
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                Silahkan masuk terlebih dahulu
              </Text>
              <Button
                component={Link}
                href={`/login?redirect=${process.env.NEXT_PUBLIC_APP_URL}/activity/${params.slug}`}
              >
                Masuk
              </Button>
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
