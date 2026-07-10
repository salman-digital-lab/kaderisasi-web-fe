import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AspectRatio,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconCalendarTime,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { getClub } from "@/services/club.cache";
import { getCustomFormByFeature } from "@/services/customForm";
import { verifySession } from "@/functions/server/session";
import ClubRegistrationInfo from "@/components/common/ClubRegistrationInfo";
import ClubRegistrationButtonServerWrapper from "@/components/common/ClubRegistrationButton/ServerWrapper";
import type { CustomForm } from "@/types/api/customForm";
import type { ClubDetail } from "@/types/model/club";

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ClubDetailPageProps) {
  const { id } = await params;

  try {
    const club = await getClub({ id });
    return {
      title: club.name,
      description:
        club.short_description || `Detail ${club.name} di Kaderisasi Salman`,
    };
  } catch {
    return {
      title: "Club",
    };
  }
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  const sessionData = await verifySession();

  let club: ClubDetail | undefined;
  try {
    club = await getClub({ id });
  } catch {
    notFound();
  }

  if (!club) {
    notFound();
  }

  let customForm: CustomForm | undefined;
  try {
    customForm = await getCustomFormByFeature({
      feature_type: "club_registration",
      feature_id: club.id,
    });
  } catch {
    customForm = undefined;
  }

  const logoUrl = club.logo
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${club.logo}`
    : undefined;

  return (
    <main>
      <Container size="lg" py={{ base: "lg", md: "xl" }}>
        <Stack gap="xl">
          <Paper withBorder p={{ base: "md", md: "xl" }} radius="md">
            <Group align="center" gap="xl" wrap="wrap">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={club.name}
                  width={128}
                  height={128}
                  sizes="128px"
                  style={{ objectFit: "contain", borderRadius: 12 }}
                  priority
                />
              ) : (
                <ThemeIcon size={128} radius="md" variant="light">
                  <IconUsers size={64} />
                </ThemeIcon>
              )}

              <Stack gap="sm" style={{ flex: 1, minWidth: 260 }}>
                <Group gap="sm">
                  <Badge
                    color={club.club_type === "AVISMAN" ? "violet" : "blue"}
                  >
                    {club.club_type}
                  </Badge>
                  {club.is_registration_open && (
                    <Badge color="green">Pendaftaran Dibuka</Badge>
                  )}
                </Group>
                <Title order={1}>{club.name}</Title>
                {club.short_description && (
                  <Text size="lg" c="dimmed">
                    {club.short_description}
                  </Text>
                )}
                {(club.start_period || club.end_period) && (
                  <Group gap="xs">
                    <IconCalendarTime size={18} />
                    <Text>
                      {club.start_period
                        ? dayjs(club.start_period)
                            .locale("id")
                            .format("MMMM YYYY")
                        : "Mulai belum ditentukan"}{" "}
                      -{" "}
                      {club.end_period
                        ? dayjs(club.end_period)
                            .locale("id")
                            .format("MMMM YYYY")
                        : "Sekarang"}
                    </Text>
                  </Group>
                )}
              </Stack>

              <Stack gap="sm" style={{ width: 280 }}>
                <ClubRegistrationButtonServerWrapper
                  clubId={club.id}
                  clubName={club.name}
                  isAuthenticated={Boolean(sessionData.session)}
                  afterRegistrationInfo={
                    club.registration_info?.after_registration_info
                  }
                  isRegistrationOpen={Boolean(club.is_registration_open)}
                  customForm={customForm}
                />
              </Stack>
            </Group>
          </Paper>

          <ClubRegistrationInfo registrationInfo={club.registration_info} />

          {club.description && (
            <Paper withBorder p="xl" radius="md">
              <Title order={2} mb="md">
                Tentang Club
              </Title>
              <div dangerouslySetInnerHTML={{ __html: club.description }} />
            </Paper>
          )}

          {!!club.leadership?.length && (
            <Paper withBorder p="xl" radius="md">
              <Title order={2} mb="md">
                Pengurus
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {club.leadership.map((role) => (
                  <Card key={role.id} withBorder radius="md">
                    <Text fw={700}>
                      {role.registration?.member?.profile?.name || "Anggota"}
                    </Text>
                    <Text c="dimmed">{role.role_name}</Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Paper>
          )}

          {!!club.activities?.length && (
            <Paper withBorder p="xl" radius="md">
              <Title order={2} mb="md">
                Kegiatan Terkait
              </Title>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                {club.activities.map((activity) => (
                  <Card key={activity.id} withBorder radius="md">
                    <Stack gap="xs">
                      <Group justify="space-between" align="start">
                        <Title order={3} size="h4">
                          {activity.name}
                        </Title>
                        <Badge variant="light">
                          {activity.is_registration_open
                            ? "Pendaftaran Dibuka"
                            : "Informasi"}
                        </Badge>
                      </Group>
                      {activity.activity_start && (
                        <Group gap="xs">
                          <IconCalendarEvent size={16} />
                          <Text size="md">
                            {dayjs(activity.activity_start)
                              .locale("id")
                              .format("DD MMMM YYYY")}
                          </Text>
                        </Group>
                      )}
                      <Divider />
                      <Group justify="flex-end">
                        <Link
                          href={`/activity/${activity.slug}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="light" size="xs">
                            Lihat Kegiatan
                          </Button>
                        </Link>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Paper>
          )}

          {!!club.media?.items?.length && (
            <Paper withBorder p="xl" radius="md">
              <Title order={2} mb="md">
                Media
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {club.media.items.map((item) =>
                  item.media_type === "image" ? (
                    <AspectRatio key={item.media_url} ratio={16 / 10}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.media_url}`}
                        alt={club.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio key={item.media_url} ratio={16 / 9}>
                      <iframe
                        src={item.media_url}
                        title={`${club.name} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 0, borderRadius: 8 }}
                      />
                    </AspectRatio>
                  ),
                )}
              </SimpleGrid>
            </Paper>
          )}

          <Group justify="center">
            <Link href="/clubs" style={{ textDecoration: "none" }}>
              <Button variant="light">Kembali ke Daftar Club</Button>
            </Link>
          </Group>
        </Stack>
      </Container>
    </main>
  );
}
