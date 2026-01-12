"use client";

import ActivityPersonalCard from "@/components/common/ActivityPersonalCard";
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
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconActivity,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Activity, Registrant } from "@/types/model/activity";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";

type PersonalActivityDataProps = {
  activities: ({ activity: Activity } & Registrant)[];
};

export default function PersonalActivityData({
  activities,
}: PersonalActivityDataProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalActivities = activities.length;

    // Rejected: Tidak diterima & Tidak lulus
    const rejectedCount = activities.filter(
      (a) =>
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA ||
        a.status === ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS,
    ).length;

    // Registered: All except rejected
    const registeredCount = activities.filter(
      (a) =>
        a.status !== ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_DITERIMA &&
        a.status !== ACTIVITY_REGISTRANT_STATUS_ENUM.TIDAK_LULUS,
    ).length;

    return {
      totalActivities,
      registeredCount,
      rejectedCount,
    };
  }, [activities]);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.activity.name.toLowerCase().includes(searchLower) ||
        activity.activity.description?.toLowerCase().includes(searchLower) ||
        activity.status.toLowerCase().includes(searchLower)
      );
    });
  }, [activities, searchQuery]);

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Reset page when search changes
  useMemo(() => {
    setPage(1);
  }, [searchQuery]);

  if (activities.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={300} gap="lg">
          <ThemeIcon size={80} radius="xl" variant="light" color="gray">
            <IconActivity size={40} />
          </ThemeIcon>
          <Stack align="center" gap="xs">
            <Text size="xl" fw={600} c="dimmed">
              Belum Ada Kegiatan
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={300}>
              Mulai daftarkan diri Anda pada kegiatan-kegiatan menarik untuk
              mengembangkan kemampuan dan jaringan
            </Text>
          </Stack>
          <Link href="/activity" style={{ textDecoration: "none" }}>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="filled"
              size="md"
            >
              Jelajahi Kegiatan
            </Button>
          </Link>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p={{ base: "md", sm: "lg" }} radius="md" withBorder>
      <Stack gap="lg">
        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconActivity size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Total Kegiatan
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.totalActivities}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconCheck size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Terdaftar
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.registeredCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="red">
                  <IconX size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Ditolak
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.rejectedCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Search */}
        <Box>
          <TextInput
            placeholder="Cari berdasarkan nama kegiatan atau status..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Results Count */}
        {filteredActivities.length !== activities.length && (
          <Text size="sm" c="dimmed">
            Menampilkan {filteredActivities.length} dari {activities.length}{" "}
            kegiatan
          </Text>
        )}

        {/* Activities Grid */}
        <Grid>
          {paginatedActivities.map((activity) => (
            <Grid.Col
              key={activity.activity_id}
              span={{ base: 12, sm: 6, lg: 4 }}
            >
              <ActivityPersonalCard
                activityName={activity.activity.name}
                slug={activity.activity.slug}
                registrationStatus={activity.status}
                imageUrl={activity.activity.additional_config?.images?.[0]}
                visibleAt={activity.visible_at}
              />
            </Grid.Col>
          ))}
        </Grid>

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
              Coba ubah kata kunci pencarian atau filter yang digunakan
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
    </Paper>
  );
}
