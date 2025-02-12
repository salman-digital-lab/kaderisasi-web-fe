"use client";

import { useEffect, useState } from "react";
import { getMonthlyLeaderboard } from "@/services/leaderboard";
import { IconUser } from "@tabler/icons-react";
import {
  Paper,
  Title,
  Select,
  Avatar,
  Text,
  Group,
  Stack,
  Pagination,
  Loader,
  Container,
} from "@mantine/core";

import dayjs from "dayjs";
import styles from "./style.module.css";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { MonthlyLeaderboard } from "@/types/model/achievement";
const MonthlyLeaderboardList = () => {
  const [leaderboard, setLeaderboard] = useState<MonthlyLeaderboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const fetchLeaderboard = async (page: number, month: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMonthlyLeaderboard(page, 10, month);
      setLeaderboard(response.data.data);
      setTotalItems(response.data.meta.total);
    } catch (error) {
      setError("Failed to load leaderboard data. Please try again later.");
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentPage, selectedMonth);
  }, [currentPage, selectedMonth]);

  // Generate last 12 months options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = dayjs().subtract(i, "month");
    return {
      label: date.locale("id").format("MMMM YYYY"),
      value: date.format("YYYY-MM"),
    };
  });

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Leaderboard Bulanan</Title>
        <Select
          value={selectedMonth}
          onChange={(value) => {
            if (value) {
              setSelectedMonth(value);
              setCurrentPage(1);
            }
          }}
          data={monthOptions}
          w={200}
          disabled={loading}
        />
      </Group>

      {loading ? (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      ) : (
        <Stack gap="md">
          {leaderboard.map((entry, index) => (
            <Paper
              key={entry.id}
              shadow="xs"
              p="md"
              withBorder
              className={styles.leaderboardItem}
            >
              <Group w="100%" justify="space-between">
                <Group flex={1} gap="md">
                  <Text size="xl" fw={700} w={40} ta="center" c="dimmed">
                    {index + 1 + (currentPage - 1) * 10}
                  </Text>
                  <Avatar
                    src={entry.user.profile?.picture}
                    alt={entry.user.profile?.name}
                    size="md"
                    radius="xl"
                  >
                    <IconUser size={24} />
                  </Avatar>
                  <div>
                    <Text fw={500}>{entry.user.profile?.name}</Text>
                    <Text size="sm" c="dimmed">
                      {
                        USER_LEVEL_RENDER[
                          (entry.user.profile
                            ?.level as keyof typeof USER_LEVEL_RENDER) ||
                            USER_LEVEL_ENUM.JAMAAH
                        ]
                      }
                    </Text>
                  </div>
                </Group>
                <Text fw={700} size="lg" c="blue">
                  {entry.score} poin
                </Text>
              </Group>
            </Paper>
          ))}

          {leaderboard.length === 0 && !error && (
            <Text c="dimmed" ta="center" py="xl">
              Tidak ada data dibulan ini
            </Text>
          )}
        </Stack>
      )}

      {!loading && totalItems > 0 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={Math.ceil(totalItems / 10)}
          />
        </Group>
      )}
    </Container>
  );
};

export default MonthlyLeaderboardList;
