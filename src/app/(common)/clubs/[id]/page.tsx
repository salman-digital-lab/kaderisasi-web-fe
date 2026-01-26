import { notFound } from "next/navigation";
import {
  Container,
  Text,
  Title,
  Badge,
  Group,
  Stack,
  Paper,
  Avatar,
  Divider,
  Box,
  Flex,
  ThemeIcon,
  Button,
} from "@mantine/core";
import { getClub } from "../../../../services/club";
import { getCustomFormByFeature } from "../../../../services/customForm";
import {
  IconCalendarTime,
  IconUsers,
  IconInfoCircle,
  IconClipboardList,
  IconArrowRight,
} from "@tabler/icons-react";
import MediaCarousel from "../../../../components/common/MediaCarousel";
import dayjs from "dayjs";
import "dayjs/locale/id";

// Set the locale globally for this page
dayjs.locale("id");
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  try {
    const club = await getClub({ id: params.id });
    const clubDescription =
      club.short_description ||
      `${club.name} - Unit Kegiatan/Kepanitiaan di Kaderisasi Salman`;
    const clubImage = club.logo
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
      : undefined;

    return {
      title: club.name,
      description: clubDescription,
      openGraph: {
        title: club.name,
        description: clubDescription,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/clubs/${params.id}`,
        type: "website",
        images: clubImage
          ? [
              {
                url: clubImage,
                width: 400,
                height: 400,
                alt: club.name,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary",
        title: club.name,
        description: clubDescription,
        images: clubImage ? [clubImage] : undefined,
      },
    };
  } catch {
    return {
      title: "Unit Kegiatan",
      description: "Detail Unit Kegiatan atau Kepanitiaan di Kaderisasi Salman",
    };
  }
}

export default async function ClubDetailPage(props: Props) {
  const params = await props.params;

  try {
    const club = await getClub({ id: params.id });

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

    return (
      <main>
        {/* Simple Hero Section */}
        <Container size="lg" py="xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            gap="xl"
          >
            {/* Club Logo */}
            <Box style={{ textAlign: "center" }}>
              <Avatar
                src={
                  club.logo
                    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
                    : null
                }
                size={120}
                radius="xl"
                style={{
                  border: "2px solid var(--mantine-color-gray-3)",
                  margin: "0 auto",
                }}
              >
                {!club.logo && <IconUsers size={60} />}
              </Avatar>
            </Box>

            {/* Club Info */}
            <Stack gap="md" ta="center">
              <Title
                order={1}
                style={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {club.name}
              </Title>

              {club.short_description && (
                <Text
                  size="lg"
                  c="dimmed"
                  ta="center"
                  style={{ maxWidth: 600 }}
                >
                  {club.short_description}
                </Text>
              )}

              <Group gap="md" justify="center" mt="md">
                <Badge
                  size="lg"
                  variant="light"
                  color="green"
                  leftSection={<IconUsers size={16} />}
                >
                  Klub Aktif
                </Badge>
                {club.start_period && (
                  <Badge
                    size="lg"
                    variant="light"
                    color="blue"
                    leftSection={<IconCalendarTime size={16} />}
                  >
                    Mulai {dayjs(club.start_period).format("MMMM YYYY")}
                  </Badge>
                )}
                {club.end_period && (
                  <Badge
                    size="lg"
                    variant="light"
                    color="orange"
                    leftSection={<IconCalendarTime size={16} />}
                  >
                    Hingga {dayjs(club.end_period).format("MMMM YYYY")}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Flex>
        </Container>

        {/* Registration Section - Only show when registration is open */}
        {club.is_registration_open && (
          <Container size="lg" py="xl">
            <Paper
              p="xl"
              radius="lg"
              shadow="md"
              style={{
                background:
                  "linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-7) 100%)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Stack gap="lg" align="center">
                <ThemeIcon size={60} radius="xl" variant="white" color="blue">
                  <IconClipboardList size={32} />
                </ThemeIcon>

                <Stack gap="sm" align="center">
                  <Title order={2} c="white" fw={700}>
                    Pendaftaran Sedang Dibuka!
                  </Title>
                </Stack>

                <Link
                  href={`/clubs/registration-info/${club.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    size="lg"
                    variant="white"
                    color="blue"
                    rightSection={<IconArrowRight size={20} />}
                    style={{
                      fontWeight: 600,
                      fontSize: "16px",
                      height: "50px",
                      paddingLeft: "32px",
                      paddingRight: "32px",
                    }}
                  >
                    Daftar Sekarang
                  </Button>
                </Link>
              </Stack>
            </Paper>
          </Container>
        )}

        <Container size="lg" py="xl">
          <Stack gap="xl">
            {/* Description Section */}
            <Paper p="xl" radius="md" shadow="sm">
              <Group mb="md">
                <IconInfoCircle size={24} />
                <Title order={2}>Tentang Klub</Title>
              </Group>
              <Divider mb="md" />
              <Box
                style={{
                  "& p": { marginBottom: "1rem" },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    marginBottom: "0.5rem",
                    marginTop: "1rem",
                  },
                  "& ul, & ol": { marginBottom: "1rem", paddingLeft: "1.5rem" },
                  "& li": { marginBottom: "0.25rem" },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  },
                  "& blockquote": {
                    borderLeft: "4px solid #228be6",
                    paddingLeft: "1rem",
                    marginLeft: 0,
                    fontStyle: "italic",
                    backgroundColor: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "4px",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: club.description }}
              />
            </Paper>

            {/* Media Gallery Carousel */}
            <MediaCarousel media={club.media} clubName={club.name} />
          </Stack>
        </Container>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
