import { Paper, Stack, Text, Accordion, Badge, Group, Tooltip } from "@mantine/core";
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
                <Tooltip label={achievement.remark}>
                  <Badge
                    variant="outline"
                    color={ACHIEVEMENT_STATUS_COLOR[achievement.status]}
                  >
                    {ACHIEVEMENT_STATUS_RENDER[achievement.status]}
                  </Badge>
                </Tooltip>
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
              <Stack>
                <Text size="sm" c="dimmed">
                  {achievement.description}
                </Text>
                <Text size="sm">Poin: {achievement.score}</Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
    </Paper>
  );
}
