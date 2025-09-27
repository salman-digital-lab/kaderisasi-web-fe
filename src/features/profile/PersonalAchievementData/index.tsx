import {
  Paper,
  Stack,
  Text,
  Badge,
  Group,
  Alert,
  Button,
  Card,
  SimpleGrid,
  Title,
  ThemeIcon,
  Center,
  Box,
  Divider,
  ActionIcon,
  Collapse,
} from "@mantine/core";
import {
  IconExclamationCircle,
  IconAlertCircle,
  IconDownload,
  IconEdit,
  IconTrophy,
  IconChevronDown,
  IconChevronUp,
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
import { useState } from "react";

type PersonalAchievementDataProps = {
  achievements: Achievement[];
};

// Achievement Card Component
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isRejected = achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED;
  const hasRejectionReason = isRejected && achievement.remark;

  const getStatusIcon = (status: number) => {
    if (status === ACHIEVEMENT_STATUS_ENUM.REJECTED) {
      return <IconExclamationCircle size={12} />;
    }
    return null;
  };

  const getStatusColor = (status: number) => {
    return ACHIEVEMENT_STATUS_COLOR[status as keyof typeof ACHIEVEMENT_STATUS_COLOR] || "gray";
  };

  return (
    <Card 
      withBorder 
      radius="md" 
      p="md" 
      style={{ 
        height: "100%",
        borderColor: hasRejectionReason ? 'var(--mantine-color-red-3)' : undefined,
        backgroundColor: hasRejectionReason ? 'var(--mantine-color-red-0)' : undefined
      }}
    >
      <Stack gap="md" style={{ height: "100%" }}>
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Group align="center" gap="xs">
            <ThemeIcon
              size="lg"
              variant="light"
              color={getStatusColor(achievement.status)}
            >
              <IconTrophy size={18} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Title order={4} size="h5" lineClamp={2}>
                {achievement.name}
              </Title>
              <Badge size="sm" variant="light" mt="xs">
                {ACHIEVEMENT_TYPE_RENDER[achievement.type]}
              </Badge>
            </Box>
          </Group>
        </Group>

        {/* Status Badge */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Badge
              variant="outline"
              color={getStatusColor(achievement.status)}
              leftSection={getStatusIcon(achievement.status)}
              size="md"
            >
              {ACHIEVEMENT_STATUS_RENDER[achievement.status]}
            </Badge>
            {/* Only show points for approved achievements */}
            {achievement.status === ACHIEVEMENT_STATUS_ENUM.APPROVED && (
              <Badge variant="light" color="blue" size="sm">
                {achievement.score} Poin
              </Badge>
            )}
          </Group>
          {/* Button to toggle rejection reason */}
          {hasRejectionReason && (
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconAlertCircle size={12} />}
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                backgroundColor: 'var(--mantine-color-red-1)',
                borderColor: 'var(--mantine-color-red-3)'
              }}
            >
              {isExpanded ? 'Sembunyikan' : 'Lihat Alasan'}
            </Button>
          )}
        </Group>

        {/* Description with Expand/Collapse */}
        {achievement.description && (
          <Stack gap="xs">
            <Text size="sm" c="dimmed" lineClamp={showFullDescription ? undefined : 2}>
              {achievement.description}
            </Text>
            {achievement.description.length > 100 && (
              <Button
                variant="light"
                color="gray"
                size="xs"
                fullWidth
                onClick={() => setShowFullDescription(!showFullDescription)}
                leftSection={showFullDescription ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                style={{
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  borderColor: 'var(--mantine-color-gray-3)',
                  marginTop: '4px'
                }}
              >
                {showFullDescription ? 'Tampilkan lebih sedikit' : 'Tampilkan selengkapnya'}
              </Button>
            )}
          </Stack>
        )}

        {/* Spacer to push buttons to bottom */}
        <Box style={{ flex: 1 }} />

        {/* Action Buttons - At bottom and stretched */}
        {(achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED ||
          achievement.status === ACHIEVEMENT_STATUS_ENUM.PENDING) && (
          <>
            <Divider />
            <Group gap="xs" grow>
              <Button
                variant="light"
                color="blue"
                size="sm"
                leftSection={<IconDownload size={14} />}
                onClick={() =>
                  handleDownloadFile(
                    achievement.proof,
                    `bukti-prestasi-${achievement.name}.pdf`,
                  )
                }
                fullWidth
              >
                Unduh Bukti
              </Button>
              <Button
                component={Link}
                href={`/leaderboard/edit/${achievement.id}`}
                variant="light"
                color={achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED ? "red" : "blue"}
                size="sm"
                leftSection={<IconEdit size={14} />}
                fullWidth
              >
                Edit Prestasi
              </Button>
            </Group>
          </>
        )}

        {/* Expandable Rejection Reason - Only for rejected achievements */}
        {hasRejectionReason && (
          <>
            <Divider />
            <Collapse in={isExpanded}>
              <Alert
                variant="light"
                color="red"
                title="Alasan Penolakan"
                icon={<IconAlertCircle size={16} />}
              >
                <Text size="sm">{achievement.remark}</Text>
              </Alert>
            </Collapse>
          </>
        )}
      </Stack>
    </Card>
  );
}

export default function PersonalAchievementData({
  achievements,
}: PersonalAchievementDataProps) {
  if (achievements.length === 0) {
    return (
      <Paper radius="md" withBorder p="xl">
        <Center>
          <Stack align="center" gap="lg" py="xl">
            <ThemeIcon size={80} variant="light" color="gray" radius="xl">
              <IconTrophy size={40} />
            </ThemeIcon>
            <Stack align="center" gap="xs">
              <Title order={3} c="dimmed">
                Belum Ada Prestasi
              </Title>
              <Text size="sm" c="dimmed" ta="center" maw={400}>
                Prestasi yang Anda daftarkan akan ditampilkan di sini. 
                Mulai daftarkan prestasi Anda untuk membangun portofolio yang mengesankan!
              </Text>
            </Stack>
            <Button 
              component={Link} 
              href="/leaderboard/submit" 
              variant="light"
              leftSection={<IconTrophy size={16} />}
            >
              Daftarkan Prestasi
            </Button>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper radius="md" withBorder p="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Group align="center" gap="xs">
            <ThemeIcon size="lg" variant="light" color="yellow">
              <IconTrophy size={20} />
            </ThemeIcon>
            <Box>
              <Title order={3} size="h4">
                Prestasi Saya
              </Title>
              <Text size="sm" c="dimmed">
                {achievements.length} prestasi terdaftar
              </Text>
            </Box>
          </Group>
          <Button 
            component={Link} 
            href="/leaderboard/submit" 
            variant="light"
            size="sm"
            leftSection={<IconTrophy size={14} />}
          >
            Tambah Prestasi
          </Button>
        </Group>

        <Divider />

        {/* Achievements Grid */}
        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing="md"
          verticalSpacing="md"
        >
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
