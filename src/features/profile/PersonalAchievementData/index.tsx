import {
  Paper,
  Stack,
  Text,
  Accordion,
  Badge,
  Group,
  Alert,
  Button,
  Grid,
  Flex,
  Box,
  Divider,
  ThemeIcon,
  TextInput,
  Card,
} from "@mantine/core";
import {
  IconExclamationCircle,
  IconAlertCircle,
  IconDownload,
  IconEdit,
  IconTrophy,
  IconCalendar,
  IconStar,
  IconFileText,
  IconSearch,
  IconPlus,
  IconTrendingUp,
  IconAward,
  IconClock,
} from "@tabler/icons-react";
import { Achievement } from "@/types/model/achievement";
import {
  ACHIEVEMENT_STATUS_RENDER,
  ACHIEVEMENT_STATUS_COLOR,
  ACHIEVEMENT_TYPE_RENDER,
} from "@/constants/render/leaderboard";
import { handleDownloadFile } from "@/functions/common/handler";
import Link from "next/link";
import { ACHIEVEMENT_STATUS_ENUM } from "@/types/constants/achievement";
import { useState, useMemo } from "react";

type PersonalAchievementDataProps = {
  achievements: Achievement[];
};

export default function PersonalAchievementData({
  achievements,
}: PersonalAchievementDataProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalScore = achievements.reduce((sum, achievement) => sum + achievement.score, 0);
    const approvedCount = achievements.filter(a => a.status === ACHIEVEMENT_STATUS_ENUM.APPROVED).length;
    const pendingCount = achievements.filter(a => a.status === ACHIEVEMENT_STATUS_ENUM.PENDING).length;
    const rejectedCount = achievements.filter(a => a.status === ACHIEVEMENT_STATUS_ENUM.REJECTED).length;
    
    return {
      totalScore,
      approvedCount,
      pendingCount,
      rejectedCount,
      totalCount: achievements.length,
    };
  }, [achievements]);

  // Filter achievements by name
  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      return achievement.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [achievements, searchQuery]);

  if (achievements.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={300} gap="lg">
          <ThemeIcon size={80} radius="xl" variant="light" color="gray">
            <IconTrophy size={40} />
          </ThemeIcon>
          <Stack align="center" gap="xs">
            <Text size="xl" fw={600} c="dimmed">
              Belum Ada Prestasi
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={300}>
              Mulai tambahkan prestasi Anda untuk meningkatkan skor leaderboard dan membangun portfolio yang mengesankan
            </Text>
          </Stack>
          <Button
            component={Link}
            href="/leaderboard/submit"
            leftSection={<IconPlus size={16} />}
            variant="filled"
            size="md"
          >
            Tambah Prestasi Pertama
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper radius="md" withBorder p="lg">
      <Stack gap="md">
        {/* Header with Statistics */}
        <Box>
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Box>
              <Text size="lg" fw={600} mb="xs">
                Prestasi Saya
              </Text>
              <Text size="sm" c="dimmed">
                Total {stats.totalCount} prestasi • {stats.totalScore} poin
              </Text>
            </Box>
            <Button
              component={Link}
              href="/leaderboard/add"
              leftSection={<IconPlus size={16} />}
              variant="light"
              size="sm"
            >
              Tambah Prestasi
            </Button>
          </Flex>
        </Box>

        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconAward size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">Disetujui</Text>
                  <Text size="sm" fw={600}>{stats.approvedCount}</Text>
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
                  <Text size="xs" c="dimmed">Menunggu</Text>
                  <Text size="sm" fw={600}>{stats.pendingCount}</Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="red">
                  <IconExclamationCircle size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">Ditolak</Text>
                  <Text size="sm" fw={600}>{stats.rejectedCount}</Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="sm" radius="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconTrendingUp size={14} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed">Total Poin</Text>
                  <Text size="sm" fw={600}>{stats.totalScore}</Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Search */}
        <Box>
          <TextInput
            placeholder="Cari prestasi..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Results Count */}
        {filteredAchievements.length !== achievements.length && (
          <Text size="sm" c="dimmed">
            Menampilkan {filteredAchievements.length} dari {achievements.length} prestasi
          </Text>
        )}
        
        {/* Achievements List */}
        <Accordion variant="separated" radius="md">
          {filteredAchievements.map((achievement) => (
            <Accordion.Item
              key={achievement.id}
              value={achievement.id.toString()}
            >
              <Accordion.Control>
                <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      variant="light"
                      color={ACHIEVEMENT_STATUS_COLOR[achievement.status]}
                    >
                      <IconStar size={14} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {achievement.name}
                      </Text>
                      <Group gap="xs" mt={4}>
                        <Badge size="xs" variant="light">
                          {ACHIEVEMENT_TYPE_RENDER[achievement.type]}
                        </Badge>
                        <Badge
                          size="xs"
                          variant="outline"
                          color={ACHIEVEMENT_STATUS_COLOR[achievement.status]}
                          leftSection={
                            achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED ? (
                              <IconExclamationCircle size={10} />
                            ) : undefined
                          }
                        >
                          {ACHIEVEMENT_STATUS_RENDER[achievement.status]}
                        </Badge>
                      </Group>
                    </Box>
                  </Group>
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={500} c="blue">
                      {achievement.score} poin
                    </Text>
                  </Group>
                </Flex>
              </Accordion.Control>
              
              <Accordion.Panel>
                <Stack gap="md">
                  {/* Description */}
                  <Box>
                    <Text size="sm" c="dimmed" mb="xs">
                      Deskripsi
                    </Text>
                    <Text size="sm" lineClamp={3}>
                      {achievement.description}
                    </Text>
                  </Box>

                  {/* Achievement Details */}
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="gray">
                          <IconCalendar size={12} />
                        </ThemeIcon>
                        <Box>
                          <Text size="xs" c="dimmed">
                            Tanggal Prestasi
                          </Text>
                          <Text size="sm" fw={500}>
                            {new Date(achievement.achievement_date).toLocaleDateString('id-ID')}
                          </Text>
                        </Box>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="blue">
                          <IconStar size={12} />
                        </ThemeIcon>
                        <Box>
                          <Text size="xs" c="dimmed">
                            Poin
                          </Text>
                          <Text size="sm" fw={500}>
                            {achievement.score} poin
                          </Text>
                        </Box>
                      </Group>
                    </Grid.Col>
                  </Grid>

                  {/* Rejection Alert */}
                  {achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Alasan Penolakan"
                      icon={<IconAlertCircle size={16} />}
                    >
                      <Text size="sm" mb="sm">
                        {achievement.remark}
                      </Text>
                      <Group gap="xs" wrap="wrap">
                        <Button
                          variant="light"
                          color="red"
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                          onClick={() =>
                            handleDownloadFile(
                              achievement.proof,
                              `bukti-prestasi-${achievement.name}.pdf`,
                            )
                          }
                        >
                          Unduh Bukti
                        </Button>
                        <Button
                          component={Link}
                          href={`/leaderboard/edit/${achievement.id}`}
                          variant="light"
                          color="blue"
                          size="xs"
                          leftSection={<IconEdit size={14} />}
                        >
                          Edit Prestasi
                        </Button>
                      </Group>
                    </Alert>
                  )}

                  {/* Pending Actions */}
                  {achievement.status === ACHIEVEMENT_STATUS_ENUM.PENDING && (
                    <Box>
                      <Divider my="sm" />
                      <Group gap="xs" wrap="wrap">
                        <Button
                          variant="light"
                          color="blue"
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                          onClick={() =>
                            handleDownloadFile(
                              achievement.proof,
                              `bukti-prestasi-${achievement.name}.pdf`,
                            )
                          }
                        >
                          Unduh Bukti
                        </Button>
                        <Button
                          component={Link}
                          href={`/leaderboard/edit/${achievement.id}`}
                          variant="light"
                          color="blue"
                          size="xs"
                          leftSection={<IconEdit size={14} />}
                        >
                          Banding Prestasi
                        </Button>
                      </Group>
                    </Box>
                  )}

                  {/* Approved Status */}
                  {achievement.status === ACHIEVEMENT_STATUS_ENUM.APPROVED && (
                    <Box>
                      <Divider my="sm" />
                      <Group gap="xs" wrap="wrap">
                        <Button
                          variant="light"
                          color="green"
                          size="xs"
                          leftSection={<IconFileText size={14} />}
                          onClick={() =>
                            handleDownloadFile(
                              achievement.proof,
                              `bukti-prestasi-${achievement.name}.pdf`,
                            )
                          }
                        >
                          Lihat Bukti
                        </Button>
                      </Group>
                    </Box>
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* No Results */}
        {filteredAchievements.length === 0 && achievements.length > 0 && (
          <Box ta="center" py="xl">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray" mb="md">
              <IconSearch size={30} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" mb="xs">
              Tidak ada prestasi yang ditemukan
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
