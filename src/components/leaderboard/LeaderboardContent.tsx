import { IconUser } from "@tabler/icons-react";
import {
  Paper,
  Title,
  Avatar,
  Text,
  Group,
  Stack,
  Container,
  Alert,
  Badge,
} from "@mantine/core";

import {
  getLifetimeLeaderboard,
  getMyLifetimeRank,
} from "@/services/leaderboard";
import { LifetimeLeaderboard } from "@/types/model/achievement";

import styles from "@/features/leaderboard/LifetimeLeaderboard/style.module.css";

interface LeaderboardContentProps {
  userSession?: string;
  userName?: string;
}

const getPositionClass = (index: number) => {
  if (index === 0) return styles.top1;
  if (index === 1) return styles.top2;
  if (index === 2) return styles.top3;
  return "";
};

export async function LeaderboardContent({
  userSession,
  userName,
}: LeaderboardContentProps) {
  let leaderboard: LifetimeLeaderboard[] = [];
  let userRank: number | null = null;
  let userScore = 0;
  let error: string | null = null;

  try {
    const leaderboardPromise = getLifetimeLeaderboard(1, 10);
    const userRankPromise = userSession
      ? getMyLifetimeRank(userSession)
      : Promise.resolve(null);

    const [leaderboardResponse, rankResponse] = await Promise.all([
      leaderboardPromise,
      userRankPromise,
    ]);

    leaderboard = leaderboardResponse.data.data;

    if (rankResponse && rankResponse.data) {
      userRank = rankResponse.data.rank;
      userScore = rankResponse.data.score;
    }
  } catch (err) {
    error = "Gagal memuat data leaderboard. Silakan coba lagi nanti.";
    console.error("Error fetching leaderboard:", err);
  }

  const isCurrentUser = (entry: LifetimeLeaderboard) => {
    return userSession && userName && entry.user.profile?.name === userName;
  };

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Peringkat Aktivis</Title>
      </Group>

      {userSession && userRank && userRank <= 10 && (
        <Alert mb="lg" color="blue" variant="light">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Peringkat Anda:</Text>
              <Text size="sm" c="dimmed">
                Total: {userScore} poin
              </Text>
            </div>
            <Badge size="lg" variant="filled" color="blue">
              #{userRank}
            </Badge>
          </Group>
        </Alert>
      )}

      {userSession && userRank && userRank > 10 && (
        <Alert mb="lg" color="orange" variant="light">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Peringkat Anda: #{userRank}</Text>
              <Text size="sm" c="dimmed">
                Total: {userScore} poin
              </Text>
              <Text size="sm">
                Anda belum masuk dalam 10 besar peringkat aktivis. Terus
                kumpulkan prestasi untuk naik peringkat!
              </Text>
            </div>
            <Badge size="lg" variant="filled" color="orange">
              #{userRank}
            </Badge>
          </Group>
        </Alert>
      )}

      <Stack gap="md">
        {leaderboard.map((entry, index) => (
          <Paper
            key={entry.id}
            shadow="xs"
            p="md"
            withBorder
            className={`${styles.leaderboardItem} ${getPositionClass(index)} ${
              isCurrentUser(entry) ? styles.currentUser : ""
            }`}
          >
            <Group w="100%" justify="space-between">
              <Group flex={1} gap="md">
                <Text
                  size="xl"
                  fw={700}
                  w={40}
                  ta="center"
                  c="dimmed"
                  className={styles.rank}
                >
                  {index + 1}
                </Text>
                <Avatar
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entry.user.profile?.picture}`}
                  alt={entry.user.profile?.name}
                  size="md"
                  radius="xl"
                >
                  <IconUser size={24} />
                </Avatar>
                <div>
                  <Group gap="xs">
                    <Text fw={500}>{entry.user.profile?.name}</Text>
                    {isCurrentUser(entry) && (
                      <Badge size="xs" variant="filled" color="blue">
                        Anda
                      </Badge>
                    )}
                  </Group>
                  <Stack gap="xs">
                    {entry.user.profile?.university?.name && (
                      <Text size="sm" c="dimmed">
                        {entry.user.profile.university.name}
                      </Text>
                    )}
                  </Stack>
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
            Belum ada data leaderboard
          </Text>
        )}

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}

export default LeaderboardContent;
