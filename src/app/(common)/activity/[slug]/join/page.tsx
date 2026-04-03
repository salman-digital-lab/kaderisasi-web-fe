import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  ThemeIcon,
  rem,
  Button,
} from "@mantine/core";
import {
  IconLogin2,
  IconUserPlus,
  IconUserOff,
  IconChevronRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { verifySession } from "@/functions/server/session";
import { getActivity } from "@/services/activity.cache";
import ErrorWrapper from "@/components/layout/Error";
import { ACTIVITY_TYPE_ENUM } from "@/types/constants/activity";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const sessionData = await verifySession();

  let activity;

  try {
    activity = await getActivity({ slug: params.slug });
  } catch {
    return <ErrorWrapper message="Kegiatan tidak ditemukan" />;
  }

  if (!activity) {
    return <ErrorWrapper message="Kegiatan tidak ditemukan" />;
  }

  // If user is already logged in, redirect directly to the custom form
  if (sessionData.session) {
    redirect(`/custom-form/activity/${activity.id}`);
  }

  const isGuestAllowed =
    activity.activity_type === ACTIVITY_TYPE_ENUM.REGISTRATION_ONLY &&
    !!activity.additional_config?.allow_guest_registration;

  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/custom-form/activity/${activity.id}`;
  const guestFormUrl = `/custom-form/activity/${activity.id}?slug=${params.slug}&reset=1`;

  const options = [
    {
      href: `/register?redirect=${formUrl}`,
      icon: <IconUserPlus style={{ width: rem(22), height: rem(22) }} />,
      color: "blue",
      title: "Buat akun",
      description:
        "Daftar akun baru, lalu langsung lanjut ke formulir pendaftaran kegiatan.",
    },
    {
      href: `/login?redirect=${formUrl}`,
      icon: <IconLogin2 style={{ width: rem(22), height: rem(22) }} />,
      color: "teal",
      title: "Masuk akun",
      description:
        "Sudah punya akun? Masuk untuk mendaftar dengan data profilmu.",
    },
    ...(isGuestAllowed
      ? [
          {
            href: guestFormUrl,
            icon: (
              <IconUserOff style={{ width: rem(22), height: rem(22) }} />
            ),
            color: "gray",
            title: "Lanjut tanpa akun",
            description:
              "Isi formulir tanpa akun. Data pendaftaran tidak terhubung ke akun manapun.",
          },
        ]
      : []),
  ];

  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <Link href={`/activity/${params.slug}`} style={{ textDecoration: "none" }}>
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xs" px={0}>
            Kembali ke Kegiatan
          </Button>
        </Link>

        <Stack gap="xs" ta="center">
          <Title order={2}>{activity.name}</Title>
          <Text c="dimmed" size="sm">
            Pilih cara kamu ingin mendaftar kegiatan ini
          </Text>
        </Stack>

        <Stack gap="sm">
          {options.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              style={{ textDecoration: "none" }}
            >
              <Card
                withBorder
                padding="md"
                radius="md"
                style={{ cursor: "pointer" }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap" gap="md">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="light"
                      color={option.color}
                    >
                      {option.icon}
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={600} size="sm">
                        {option.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {option.description}
                      </Text>
                    </Stack>
                  </Group>
                  <IconChevronRight
                    style={{
                      width: rem(16),
                      height: rem(16),
                      flexShrink: 0,
                      color: "var(--mantine-color-dimmed)",
                    }}
                  />
                </Group>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
