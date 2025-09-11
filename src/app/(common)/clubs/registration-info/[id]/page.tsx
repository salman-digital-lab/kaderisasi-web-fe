import { notFound } from "next/navigation";
import {
  Container,
  Text,
  Title,
  Badge,
  Group,
  Stack,
  Image,
  Card,
  CardSection,
  Button,
  rem,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconUsers,
  IconClipboardList,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import Link from "next/link";
import { getClub } from "../../../../../services/club";
import { getCustomFormByFeature } from "../../../../../services/customForm";
import ClubRegistrationButtonServerWrapper from "../../../../../components/common/ClubRegistrationButton/ServerWrapper";
import { verifySession } from "../../../../../functions/server/session";
import dayjs from "dayjs";
import "dayjs/locale/id";

// Set the locale globally for this page
dayjs.locale("id");

import classes from "./index.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  try {
    const club = await getClub({ id: params.id });
    return {
      title: `Pendaftaran ${club.name} - Kaderisasi Salman`,
      description: `Informasi pendaftaran dan cara bergabung dengan klub ${
        club.name
      }. ${club.short_description || ""}`,
      openGraph: {
        title: `Pendaftaran ${club.name}`,
        description: `Bergabunglah dengan klub ${club.name} di Kaderisasi Salman`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/clubs/registration-info/${params.id}`,
        type: "website",
        images: club.logo
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`,
                width: 800,
                height: 800,
                alt: club.name,
              },
            ]
          : undefined,
      },
    };
  } catch (error) {
    return {
      title: "Informasi Pendaftaran Klub - Kaderisasi Salman",
    };
  }
}

const calendarIcon = (
  <IconCalendarTime style={{ width: rem(12), height: rem(12) }} />
);

export default async function ClubRegistrationInfoPage(props: Props) {
  const params = await props.params;

  try {
    const club = await getClub({ id: params.id });
    const sessionData = await verifySession();
    const isAuthenticated = !!sessionData.session;

    // Check if custom form exists for this club
    let customForm = null;
    try {
      customForm = await getCustomFormByFeature({
        feature_type: "club_registration",
        feature_id: club.id,
      });
    } catch (error) {
      // Custom form doesn't exist, continue with regular registration
    }

    // If registration is not open, redirect to club detail page
    if (!club.is_registration_open) {
      notFound();
    }

    return (
      <Stack component="main" mt="xl">
        {/* Club Logo/Image Carousel */}
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
            withControls={false} // Single image for clubs
          >
            <CarouselSlide>
              <Image
                src={
                  club.logo
                    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
                    : `https://placehold.co/700x700?text=${encodeURIComponent(
                        club.name,
                      )}`
                }
                alt={`${club.name} Logo`}
                h={700}
                fit="contain"
                fallbackSrc={`https://placehold.co/700x700?text=${encodeURIComponent(
                  club.name,
                )}`}
                className={classes.clubLogo}
              />
            </CarouselSlide>
          </Carousel>
        </Container>

        {/* Header Section with Club Info and Registration Status */}
        <Container size="md" className={classes.header}>
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            href={`/clubs/${club.id}`}
            mt="sm"
          >
            Kembali ke Detail
          </Button>
          <Card className={classes.title} padding="lg" radius="md" withBorder>
            <Title order={1} size="h2">
              {club.name}
            </Title>

            {club.short_description && (
              <Text size="lg" c="dimmed" mt="sm">
                {club.short_description}
              </Text>
            )}

            {(club.start_period || club.end_period) && (
              <CardSection className={classes.section}>
                <Text mt="md" className={classes.label} c="dimmed">
                  Periode Kegiatan
                </Text>
                <Group gap="xs">
                  {club.start_period && (
                    <Badge
                      variant="light"
                      leftSection={calendarIcon}
                      color="blue"
                    >
                      Mulai{" "}
                      {dayjs(club.start_period)
                        .locale("id")
                        .format("MMMM YYYY")}
                    </Badge>
                  )}
                  {club.end_period && (
                    <Badge
                      variant="light"
                      leftSection={calendarIcon}
                      color="orange"
                    >
                      Hingga{" "}
                      {dayjs(club.end_period).format("MMMM YYYY")}
                    </Badge>
                  )}
                </Group>
              </CardSection>
            )}
          </Card>

          {/* Registration Control Card */}
          <Card className={classes.control} padding="lg" radius="md" withBorder>
            {isAuthenticated ? (
              <ClubRegistrationButtonServerWrapper
                clubId={club.id}
                clubName={club.name}
                isAuthenticated={isAuthenticated}
                afterRegistrationInfo={
                  club.registration_info?.after_registration_info
                }
                isRegistrationOpen={club.is_registration_open}
                customForm={customForm}
              />
            ) : (
              <Stack gap="xs">
                <Text size="xs" c="dimmed" ta="center">
                  Silahkan masuk terlebih dahulu
                </Text>
                <Button
                  component={Link}
                  href={`/login?redirect=/clubs/registration-info/${params.id}`}
                >
                  Masuk
                </Button>
              </Stack>
            )}
          </Card>
        </Container>

        {/* Registration Information Description */}
        <Container w="100%">
          <Card withBorder radius="md" className={classes.registrationCard}>
            <Title order={2} ta="center" mt="sm" mb="lg">
              <Group gap="sm" justify="center">
                <IconClipboardList size={24} />
                Informasi Pendaftaran
              </Group>
            </Title>

            {club.registration_info?.registration_info ? (
              <div
                className={classes.customFormContent}
                dangerouslySetInnerHTML={{
                  __html: club.registration_info.registration_info,
                }}
              />
            ) : (
              <div>
                <Text size="lg" mb="md">
                  {customForm
                    ? "Pendaftaran untuk klub ini menggunakan formulir khusus."
                    : "Pendaftaran untuk klub ini menggunakan sistem pendaftaran standar."}
                </Text>
                <Text>
                  Untuk bergabung dengan klub {club.name}, Anda perlu mengisi
                  formulir pendaftaran dan menunggu konfirmasi dari pengurus
                  klub.
                </Text>
                <Text mt="md" c="dimmed" size="sm">
                  Silakan klik tombol &ldquo;Daftar Klub&rdquo; di atas untuk memulai proses
                  pendaftaran.
                </Text>
                {customForm && (
                  <Text mt="md" c="blue" size="sm" fw={500}>
                    Pastikan Anda telah membaca semua persyaratan sebelum
                    mendaftar.
                  </Text>
                )}
              </div>
            )}
          </Card>
        </Container>
      </Stack>
    );
  } catch (error) {
    notFound();
  }
}
