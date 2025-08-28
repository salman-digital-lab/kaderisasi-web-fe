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
  Box,
  Flex,
  Button,
  ThemeIcon,
  Card,
} from "@mantine/core";
import Link from "next/link";
import { getClub } from "../../../../../services/club";
import {
  IconCalendarTime,
  IconUsers,
  IconClipboardList,
  IconArrowLeft,
} from "@tabler/icons-react";
import ClubRegistrationForm from "../../../../../components/common/ClubRegistrationForm";
import { verifySession } from "../../../../../functions/server/session";
import dayjs from "dayjs";
import "dayjs/locale/id";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClubRegistrationPage(props: Props) {
  const params = await props.params;

  try {
    const club = await getClub({ id: params.id });
    const sessionData = await verifySession();

    // Check if registration is open
    if (!club.is_registration_open) {
      // Redirect to club detail page if registration is closed
      return (
        <main>
          <Container size="lg" py="xl">
            <Stack gap="xl" align="center">
              <Title order={1} ta="center" c="red">
                Pendaftaran Ditutup
              </Title>
              <Text ta="center" c="dimmed" size="lg">
                Pendaftaran untuk klub ini saat ini ditutup.
              </Text>
              {club.registration_end_date && (
                <Text size="md" c="dimmed" ta="center">
                  Pendaftaran berakhir pada: {dayjs(club.registration_end_date).locale("id").format("DD MMMM YYYY")}
                </Text>
              )}
              <Button
                component={Link}
                href={`/clubs/${club.id}`}
                variant="filled"
                size="lg"
                leftSection={<IconArrowLeft size={16} />}
              >
                Kembali ke Detail Klub
              </Button>
            </Stack>
          </Container>
        </main>
      );
    }

    return (
      <main>
        {/* Navigation Back Button */}
        <Container size="lg" py="md">
          <Button
            component={Link}
            href={`/clubs/${club.id}`}
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
          >
            Kembali ke Detail Klub
          </Button>
        </Container>

        {/* Club Header Section */}
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
                Daftar ke {club.name}
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
                    Mulai{" "}
                    {dayjs(club.start_period).locale("id").format("MMMM YYYY")}
                  </Badge>
                )}
                {club.end_period && (
                  <Badge
                    size="lg"
                    variant="light"
                    color="orange"
                    leftSection={<IconCalendarTime size={16} />}
                  >
                    Hingga{" "}
                    {dayjs(club.end_period).locale("id").format("MMMM YYYY")}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Flex>
        </Container>

        {/* Registration Section */}
        <Container size="lg" py="xl">
          <Stack gap="xl">
            {/* Registration Information - Only show if there's custom info */}
            {club.registration_info?.registration_info?.trim() ? (
              <Stack gap="md">
                <Card padding="lg" radius="md" withBorder>
                  <Group gap="sm" align="center">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconClipboardList size={20} />
                    </ThemeIcon>
                    <Title order={2} c="blue.8">
                      Informasi Pendaftaran
                    </Title>
                  </Group>
                  <Box
                    style={{
                      "& p": { marginBottom: "1rem" },
                      "& h1, & h2, & h3, & h4, & h5, & h6": {
                        marginBottom: "0.5rem",
                        marginTop: "1rem",
                      },
                      "& ul, & ol": {
                        marginBottom: "1rem",
                        paddingLeft: "1.5rem",
                      },
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
                      "& a": {
                        color: "#228be6",
                        textDecoration: "underline",
                        "&:hover": {
                          textDecoration: "none",
                        },
                      },
                      "& strong, & b": {
                        fontWeight: 600,
                      },
                      "& em, & i": {
                        fontStyle: "italic",
                      },
                      "& code": {
                        backgroundColor: "#f1f3f4",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "0.9em",
                      },
                      "& pre": {
                        backgroundColor: "#f1f3f4",
                        padding: "1rem",
                        borderRadius: "8px",
                        overflow: "auto",
                        "& code": {
                          backgroundColor: "transparent",
                          padding: 0,
                        },
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: club.registration_info.registration_info,
                    }}
                  />
                </Card>
              </Stack>
            ) : null}

            {/* Registration Form */}
            <Card padding="lg" radius="md" withBorder>
              <Stack gap="lg" align="center">
                <Title order={2} ta="center">
                  Bergabung Sekarang
                </Title>
                <Text ta="center" c="dimmed" style={{ maxWidth: 500 }}>
                  Pastikan Anda telah membaca informasi pendaftaran di atas
                  dengan seksama. Isi formulir di bawah ini untuk memulai proses
                  pendaftaran.
                </Text>

                {/* Registration Form Component */}
                <Box style={{ width: "100%", maxWidth: 600 }}>
                  <ClubRegistrationForm
                    clubId={club.id}
                    clubName={club.name}
                    isAuthenticated={!!sessionData.session}
                    afterRegistrationInfo={club.registration_info?.after_registration_info}
                  />
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Container>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
