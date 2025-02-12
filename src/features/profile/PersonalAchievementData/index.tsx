import {
  Paper,
  Stack,
  Text,
  Accordion,
  Badge,
  Group,
  Tooltip,
  Alert,
} from "@mantine/core";
import { IconExclamationCircle, IconAlertCircle } from "@tabler/icons-react";
import { Achievement } from "@/types/model/achievement";
import {
  ACHIEVEMENT_STATUS_RENDER,
  ACHIEVEMENT_STATUS_COLOR,
  ACHIEVEMENT_TYPE_RENDER,
} from "@/constants/render/leaderboard";

type PersonalAchievementDataProps = {
  achievements: Achievement[];
};

export default function PersonalAchievementData({
  achievements,
}: PersonalAchievementDataProps) {
  if (achievements.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={200}>
          <Text size="lg" c="dimmed">
            Belum ada prestasi
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper radius="md" withBorder p="lg">
      <Stack>
        {achievements.map((achievement) => (
          <Accordion key={achievement.id} variant="contained">
            <Accordion.Item
              key={achievement.id}
              value={achievement.id.toString()}
            >
              <Accordion.Control>
                <Group>
                  <Text fw={600}>{achievement.name}</Text>
                  <Badge>{ACHIEVEMENT_TYPE_RENDER[achievement.type]}</Badge>
                </Group>
                {achievement.status === 2 ? (
                  <Badge
                    variant="outline"
                    color={ACHIEVEMENT_STATUS_COLOR[achievement.status]}
                    leftSection={<IconExclamationCircle size={12} />}
                  >
                    {ACHIEVEMENT_STATUS_RENDER[achievement.status]}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    color={ACHIEVEMENT_STATUS_COLOR[achievement.status]}
                  >
                    {ACHIEVEMENT_STATUS_RENDER[achievement.status]}
                  </Badge>
                )}
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  {achievement.status === 2 && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Alasan Penolakan"
                      icon={<IconAlertCircle size={16} />}
                    >
                      {achievement.remark}
                    </Alert>
                  )}
                  <Text size="sm" c="dimmed">
                    {achievement.description}
                  </Text>
                  <Text size="sm">Poin: {achievement.score}</Text>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
      </Stack>
    </Paper>
  );
}
