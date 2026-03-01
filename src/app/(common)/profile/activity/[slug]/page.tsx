import { redirect } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Title,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconCertificate,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";

import {
  ACTIVITY_CATEGORY_RENDER,
  ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER,
  USER_LEVEL_RENDER,
} from "@/constants/render/activity";
import { verifySession } from "@/functions/server/session";
import { getActivity } from "@/services/activity.cache";
import { getActivityRegistrationData } from "@/services/activity";
import ErrorWrapper from "@/components/layout/Error";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import { Activity } from "@/types/model/activity";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const param = await props.params;
  const activity = await getActivity(param);

  return {
    title: `Pendaftaran - ${activity?.name || " Kegiatan"}`,
    description: `Detail pendaftaran kegiatan ${activity?.name}`,
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const sessionData = await verifySession();

  if (!sessionData.session) {
    redirect("/api/logout");
  }

  let activity: Activity | undefined;
  let registrationData:
    | {
        id: number;
        status: string;
        questionnaire_answer: Record<string, string>;
        created_at: string;
        updated_at: string;
        visible_at?: string;
      }
    | undefined;

  try {
    activity = await getActivity(params);
    registrationData = await getActivityRegistrationData(
      sessionData.session,
      { slug: params.slug },
    );
  } catch (error: unknown) {
    if (typeof error === "string") {
      return <ErrorWrapper message={error} />;
    }
  }

  if (!activity) {
    return <ErrorWrapper message="Activity not found" />;
  }

  if (!registrationData) {
    return <ErrorWrapper message="Registration not found" />;
  }

  const canViewCertificate =
    registrationData.status === ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN ||
    registrationData.status === ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA;

  const hasCertificate = !!activity.additional_config?.certificate_template_id;

  const formatActivityDate = () => {
    if (!activity?.activity_start) return null;

    const startDate = dayjs(activity.activity_start).locale("id");
    const endDate = activity.activity_end
      ? dayjs(activity.activity_end).locale("id")
      : null;

    if (endDate && !startDate.isSame(endDate, "day")) {
      return `${startDate.format("DD MMMM")} - ${endDate.format("DD MMMM YYYY")}`;
    }

    return startDate.format("DD MMMM YYYY");
  };

  const formatRegistrationDate = () => {
    return dayjs(registrationData.created_at)
      .locale("id")
      .format("DD MMMM YYYY [pukul] HH:mm");
  };

  const formatUpdateDate = () => {
    return dayjs(registrationData.updated_at)
      .locale("id")
      .format("DD MMMM YYYY [pukul] HH:mm");
  };

  const getRelativeTime = (date: string) => {
    const now = dayjs();
    const target = dayjs(date);
    const diffDays = target.diff(now, "day");

    if (diffDays > 0) {
      return `${diffDays} hari lagi`;
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} hari lalu`;
    }
    return "Hari ini";
  };

  return (
    <Stack component="main" gap="lg">
      <Container size="md">
        <Link
          href="/profile?tab=activity"
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            mb="md"
          >
            Kembali ke Kegiatan
          </Button>
        </Link>

        <Card withBorder radius="md" p="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={2} mb="xs">
                  {activity.name}
                </Title>
                <Group gap={7}>
                  <Badge variant="light">
                    {activity
                      ? USER_LEVEL_RENDER[activity.minimum_level]
                      : ""}
                  </Badge>
                  <Badge variant="light">
                    {activity
                      ? ACTIVITY_CATEGORY_RENDER[activity.activity_category]
                      : ""}
                  </Badge>
                </Group>
              </div>
            </Group>

            {activity.activity_start && (
              <Group
                gap="md"
                p="md"
                style={{
                  backgroundColor: "var(--mantine-color-blue-light)",
                  borderRadius: "var(--mantine-radius-md)",
                }}
              >
                <ThemeIcon size="lg" variant="filled" color="blue">
                  <IconCalendarEvent size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="blue" fw={600} tt="uppercase">
                    Tanggal Kegiatan
                  </Text>
                  <Text size="md" fw={500}>
                    {formatActivityDate()}
                  </Text>
                </div>
              </Group>
            )}
          </Stack>
        </Card>

        <Card withBorder radius="md" p="lg" mt="md">
          <Group justify="space-between" align="flex-start" mb="md">
            <Title order={4}>Status Pendaftaran</Title>
            <Badge
              size="xl"
              color={
                registrationData.status &&
                ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER[
                  registrationData.status as keyof typeof ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER
                ]
                  ? ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER[
                      registrationData.status as keyof typeof ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER
                    ]
                  : "blue"
              }
            >
              {registrationData.status}
            </Badge>
          </Group>

          {registrationData.status ===
            ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN &&
            registrationData.visible_at && (
            <Group
              gap="md"
              p="sm"
              style={{
                backgroundColor: "var(--mantine-color-orange-light)",
                borderRadius: "var(--mantine-radius-md)",
              }}
            >
              <ThemeIcon size="sm" variant="filled" color="orange">
                <IconClock size={14} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="orange" fw={600}>
                  Estimasi Pengumuman
                </Text>
                <Text size="sm" c="orange.8">
                  {dayjs(registrationData.visible_at)
                    .locale("id")
                    .format("DD MMMM YYYY [pukul] HH:mm")}
                </Text>
              </div>
              <Badge color="orange" variant="light" ml="auto">
                {getRelativeTime(registrationData.visible_at)}
              </Badge>
            </Group>
          )}

          <Stack gap="sm" mt="md">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <ThemeIcon size="xs" variant="light" color="gray">
                  <IconCheck size={12} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Tanggal Daftar
                </Text>
              </Group>
              <Text size="sm" fw={500}>
                {formatRegistrationDate()}
              </Text>
            </Group>
          </Stack>

          {canViewCertificate && hasCertificate && (
            <Link
              href={`/certificate/${registrationData.id}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                mt="lg"
                fullWidth
                color="green"
                leftSection={<IconCertificate size={18} />}
                size="md"
              >
                Lihat Sertifikat
              </Button>
            </Link>
          )}
        </Card>

        <Card withBorder radius="md" p="lg" mt="md">
          <Group gap="xs" justify="center">
            <ThemeIcon size="sm" variant="light" color="green">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text size="sm" c="dimmed" ta="center">
              Data formulir dapat dilihat pada halaman edit formulir
            </Text>
          </Group>
        </Card>
      </Container>
    </Stack>
  );
}
