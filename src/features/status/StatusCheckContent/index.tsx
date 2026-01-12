"use client";

import {
  Paper,
  Stack,
  Text,
  Grid,
  Box,
  ThemeIcon,
  TextInput,
  Card,
  Group,
  Button,
  Center,
  Pagination,
  Title,
  Badge,
  Container,
} from "@mantine/core";
import {
  IconSearch,
  IconActivity,
  IconCheck,
  IconX,
  IconClock,
  IconExternalLink,
} from "@tabler/icons-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Activity, Registrant } from "@/types/model/activity";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";

type StatusCheckContentProps = {
  activities: ({ activity: Activity } & Registrant)[];
};

// Format date to readable string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN:
      return "green";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS:
      return "red";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TERDAFTAR:
      return "blue";
    case ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN:
      return "orange";
    default:
      return "gray";
  }
};

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN:
      return <IconCheck size={16} />;
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA:
    case ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS:
      return <IconX size={16} />;
    case ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN:
      return <IconClock size={16} />;
    default:
      return <IconActivity size={16} />;
  }
};

export default function StatusCheckContent({
  activities,
}: StatusCheckContentProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalActivities = activities.length;

    const acceptedCount = activities.filter(
      (a) =>
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.DITERIMA ||
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN,
    ).length;

    const rejectedCount = activities.filter(
      (a) =>
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA ||
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS,
    ).length;

    const pendingCount = activities.filter(
      (a) =>
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.TERDAFTAR ||
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN,
    ).length;

    return {
      totalActivities,
      acceptedCount,
      rejectedCount,
      pendingCount,
    };
  }, [activities]);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.activity.name.toLowerCase().includes(searchLower) ||
        activity.status.toLowerCase().includes(searchLower)
      );
    });
  }, [activities, searchQuery]);

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Empty state - rendered after all hooks are called
  if (activities.length === 0) {
    return (
      <Container size="md" py="xl">
        <Paper radius="md" withBorder p="xl">
          <Stack align="center" justify="center" h={300} gap="lg">
            <ThemeIcon size={80} radius="xl" variant="light" color="gray">
              <IconActivity size={40} />
            </ThemeIcon>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={600} c="dimmed">
                Belum Ada Kegiatan Terdaftar
              </Text>
              <Text size="sm" c="dimmed" ta="center" maw={300}>
                Anda belum terdaftar di kegiatan manapun. Jelajahi kegiatan yang
                tersedia untuk memulai.
              </Text>
            </Stack>
            <Link href="/activity" style={{ textDecoration: "none" }}>
              <Button leftSection={<IconExternalLink size={16} />} size="md">
                Jelajahi Kegiatan
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Title order={2} mb="xs">
            Cek Status Kegiatan
          </Title>
          <Text c="dimmed">
            Lihat status pendaftaran Anda di berbagai kegiatan
          </Text>
        </Box>

        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="blue">
                  <IconActivity size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Total
                  </Text>
                  <Text size="lg" fw={600}>
                    {stats.totalActivities}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="green">
                  <IconCheck size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Diterima
                  </Text>
                  <Text size="lg" fw={600}>
                    {stats.acceptedCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="orange">
                  <IconClock size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Menunggu
                  </Text>
                  <Text size="lg" fw={600}>
                    {stats.pendingCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="red">
                  <IconX size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Ditolak
                  </Text>
                  <Text size="lg" fw={600}>
                    {stats.rejectedCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Search */}
        <TextInput
          placeholder="Cari berdasarkan nama kegiatan atau status..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Results Count */}
        {filteredActivities.length !== activities.length && (
          <Text size="sm" c="dimmed">
            Menampilkan {filteredActivities.length} dari {activities.length}{" "}
            kegiatan
          </Text>
        )}

        {/* Activities List */}
        <Stack gap="md">
          {paginatedActivities.map((activity) => (
            <Card key={activity.activity_id} withBorder p="md" radius="md">
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: 200 }}>
                    <Text fw={600} size="md">
                      {activity.activity.name}
                    </Text>
                  </Box>
                  <Link
                    href={`/activity/${activity.activity.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      size="xs"
                      variant="light"
                      rightSection={<IconExternalLink size={14} />}
                    >
                      Detail
                    </Button>
                  </Link>
                </Group>
                <Group gap="xs" align="center">
                  <Badge
                    size="sm"
                    variant="light"
                    color={getStatusColor(activity.status)}
                    leftSection={getStatusIcon(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </Group>
                {activity.status ===
                  ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN &&
                  activity.visible_at && (
                    <Group gap={6} align="center">
                      <ThemeIcon size="xs" variant="transparent" color="orange">
                        <IconClock size={14} />
                      </ThemeIcon>
                      <Text size="xs" c="orange.7" fw={500}>
                        Estimasi pengumuman: {formatDate(activity.visible_at)}
                      </Text>
                    </Group>
                  )}
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* No Results */}
        {filteredActivities.length === 0 && activities.length > 0 && (
          <Box ta="center" py="xl">
            <ThemeIcon
              size={60}
              radius="xl"
              variant="light"
              color="gray"
              mb="md"
            >
              <IconSearch size={30} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" mb="xs">
              Tidak ada kegiatan yang ditemukan
            </Text>
            <Text size="sm" c="dimmed">
              Coba ubah kata kunci pencarian
            </Text>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Center>
            <Pagination
              total={totalPages}
              onChange={setPage}
              value={page}
              siblings={1}
              size="sm"
            />
          </Center>
        )}
      </Stack>
    </Container>
  );
}
