"use client";

import { Flex, Paper } from "@mantine/core";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";

type PersonalActivityDataProps = {
  data: RuangCurhatData[];
};

export default function RuangCurhatList({ data }: PersonalActivityDataProps) {
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
