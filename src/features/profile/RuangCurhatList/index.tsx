"use client";

import {
  Paper,
  Stack,
  Text,
  Grid,
  Flex,
  Box,
  ThemeIcon,
  TextInput,
  Card,
  Group,
  Badge,
  Button,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconSearch,
  IconPlus,
  IconCalendar,
  IconUser,
  IconClock,
  IconCheck,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";
import { PROBLEM_STATUS_ENUM } from "@/types/constants/ruangcurhat";
import { useState, useMemo } from "react";
import Link from "next/link";

type PersonalActivityDataProps = {
  data: RuangCurhatData[];
};

export default function RuangCurhatList({ data }: PersonalActivityDataProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = data.length;
    const completedCount = data.filter(
      (session) => session.status === PROBLEM_STATUS_ENUM.SUDAH_DITANGANI,
    ).length;
    const pendingCount = data.filter(
      (session) =>
        session.status === PROBLEM_STATUS_ENUM.SEDANG_MEMILIH_JADWAL ||
        session.status === PROBLEM_STATUS_ENUM.SEDANG_DITANGANI,
    ).length;
    const cancelledCount = data.filter(
      (session) => session.status === PROBLEM_STATUS_ENUM.BATAL,
    ).length;
    const recentSessions = data.filter((session) => {
      const sessionDate = new Date(session.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return sessionDate >= thirtyDaysAgo;
    }).length;

    return {
      totalSessions,
      completedCount,
      pendingCount,
      cancelledCount,
      recentSessions,
    };
  }, [data]);

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    return data.filter((session) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        session.problem_category.toLowerCase().includes(searchLower) ||
        session.problem_description.toLowerCase().includes(searchLower) ||
        session.handling_technic.toLowerCase().includes(searchLower) ||
        (session.owner_name &&
          session.owner_name.toLowerCase().includes(searchLower))
      );
    });
  }, [data, searchQuery]);

  if (data.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={300} gap="lg">
          <ThemeIcon size={80} radius="xl" variant="light" color="gray">
            <IconMessageCircle size={40} />
          </ThemeIcon>
          <Stack align="center" gap="xs">
            <Text size="xl" fw={600} c="dimmed">
              Belum Ada Sesi Konseling
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={300}>
              Mulai konseling untuk mendapatkan dukungan dan bimbingan dalam
              mengatasi masalah Anda
            </Text>
          </Stack>
          <Link href="/consultation" style={{ textDecoration: "none" }}>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="filled"
              size="md"
            >
              Mulai Konseling Pertama
            </Button>
          </Link>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p={{ base: "md", sm: "lg" }} radius="md" withBorder>
      <Stack gap="md">
        {/* Header with Statistics */}
        <Box>
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Box>
              <Text size="lg" fw={600} mb="xs">
                Sesi Ruang Curhat Saya
              </Text>
              <Text size="sm" c="dimmed">
                Total {stats.totalSessions} sesi • {stats.recentSessions} sesi
                dalam 30 hari terakhir
              </Text>
            </Box>
            <Link href="/consultation" style={{ textDecoration: "none" }}>
              <Button
                leftSection={<IconPlus size={16} />}
                variant="light"
                size="sm"
              >
                Curhat Baru
              </Button>
            </Link>
          </Flex>
        </Box>

        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconCheck size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Selesai
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.completedCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="yellow">
                  <IconClock size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Berlangsung
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.pendingCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="red">
                  <IconX size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    Dibatalkan
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.cancelledCount}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconCalendar size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">
                    30 Hari Terakhir
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.recentSessions}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Search */}
        <Box>
          <TextInput
            placeholder="Cari berdasarkan kategori, deskripsi, atau teknik penanganan..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Results Count */}
        {filteredSessions.length !== data.length && (
          <Text size="sm" c="dimmed">
            Menampilkan {filteredSessions.length} dari {data.length} sesi
            konseling
          </Text>
        )}

        {/* Sessions List */}
        <Stack gap="md">
          {filteredSessions.map((session) => (
            <RuangCurhatCard key={session.id} data={session} />
          ))}
        </Stack>

        {/* No Results */}
        {filteredSessions.length === 0 && data.length > 0 && (
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
              Tidak ada sesi konseling yang ditemukan
            </Text>
            <Text size="sm" c="dimmed">
              Coba ubah kata kunci pencarian atau filter yang digunakan
            </Text>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
