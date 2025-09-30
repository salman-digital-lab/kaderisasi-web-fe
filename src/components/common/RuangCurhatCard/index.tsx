import {
  Badge,
  Card,
  Group,
  Text,
  Avatar,
  Stack,
  Flex,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { 
  IconCalendarTime, 
  IconUser, 
  IconMessageCircle, 
  IconClock,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconHeartHandshake,
} from "@tabler/icons-react";

import {
  PROBLEM_OWNER_RENDER,
  PROBLEM_STATUS_RENDER,
  PROBLEM_STATUS_RENDER_COLOR,
} from "../../../constants/render/ruangcurhat";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import { PROBLEM_OWNER_ENUM, PROBLEM_STATUS_ENUM } from "@/types/constants/ruangcurhat";
import dayjs from "dayjs";
import "dayjs/locale/id";

// Set the locale globally for this component
dayjs.locale("id");

type RuangCurhatCardProps = {
  data: RuangCurhatData;
};

export default function RuangCurhatCard({ data }: RuangCurhatCardProps) {
  const getStatusIcon = (status: PROBLEM_STATUS_ENUM) => {
    switch (status) {
      case PROBLEM_STATUS_ENUM.SUDAH_DITANGANI:
        return <IconCheck size={12} />;
      case PROBLEM_STATUS_ENUM.SEDANG_MEMILIH_JADWAL:
      case PROBLEM_STATUS_ENUM.SEDANG_DITANGANI:
        return <IconClock size={12} />;
      case PROBLEM_STATUS_ENUM.BATAL:
        return <IconX size={12} />;
      default:
        return <IconAlertCircle size={12} />;
    }
  };

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size="md" radius="xl" variant="light" color="blue">
              <IconMessageCircle size={16} />
            </ThemeIcon>
            <Box>
              <Text fw={600} size="md" lineClamp={1}>
                {PROBLEM_OWNER_RENDER[data.problem_ownership]}
              </Text>
              <Text size="sm" c="dimmed">
                {dayjs(data.created_at).format("DD MMMM YYYY")}
              </Text>
            </Box>
          </Group>
          <Badge 
            color={PROBLEM_STATUS_RENDER_COLOR[data.status]}
            leftSection={getStatusIcon(data.status)}
            variant="light"
          >
            {PROBLEM_STATUS_RENDER[data.status]}
          </Badge>
        </Flex>

        {/* Tags */}
        <Group gap="xs" wrap="wrap">
          <Badge variant="light" color="yellow" size="sm">
            {data.handling_technic}
          </Badge>
          <Badge variant="light" color="purple" size="sm">
            {data.problem_category}
          </Badge>
        </Group>

        {/* Problem Description */}
        <Box>
          <Text size="sm" c="dimmed" mb="xs">
            Deskripsi Masalah
          </Text>
          <Text 
            size="sm" 
            lineClamp={3}
            style={{ 
              lineHeight: 1.5,
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}
          >
            {data.problem_description}
          </Text>
        </Box>

        {/* Owner Name (if applicable) */}
        {data.problem_ownership === PROBLEM_OWNER_ENUM.TEMAN && (
          <Box>
            <Text size="sm" c="dimmed" mb="xs">
              Pemilik Masalah
            </Text>
            <Text 
              size="sm" 
              fw={500}
              lineClamp={2}
              style={{ 
                wordBreak: 'break-word',
                lineHeight: 1.4
              }}
            >
              {data.owner_name}
            </Text>
          </Box>
        )}

        {/* Counselor Info */}
        <Box>
          <Text size="sm" c="dimmed" mb="xs">
            Konselor
          </Text>
          {data.adminUser ? (
            <Group gap="sm" align="flex-start">
              <Avatar radius="xl" size="sm" />
              <Box flex={1}>
                <Text 
                  size="sm" 
                  fw={500}
                  lineClamp={1}
                  style={{ wordBreak: 'break-word' }}
                >
                  {data.adminUser?.display_name}
                </Text>
                <Text 
                  size="xs" 
                  c="dimmed"
                  lineClamp={1}
                  style={{ wordBreak: 'break-all' }}
                >
                  {data.adminUser?.email}
                </Text>
              </Box>
            </Group>
          ) : (
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="yellow">
                <IconClock size={12} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                Belum ada konselor yang ditugaskan
              </Text>
            </Group>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
