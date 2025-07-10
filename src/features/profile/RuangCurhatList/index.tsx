"use client";

import { Flex, Paper, Stack, Text } from "@mantine/core";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";

type PersonalActivityDataProps = {
  data: RuangCurhatData[];
};

export default function RuangCurhatList({ data }: PersonalActivityDataProps) {
  if (data.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={200}>
          <Text size="lg" c="dimmed">
            Belum pernah mengikuti ruang curhat
          </Text>
        </Stack>
      </Paper>
    );
  }
  
  return (
    <Paper radius="md" withBorder p="lg">
      <Flex direction="column" gap="md">
        {data.map((item) => (
          <RuangCurhatCard key={item.id} data={item} />
        ))}
      </Flex>
    </Paper>
  );
}
