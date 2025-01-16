"use client";

import ActivityPersonalCard from "@/components/common/ActivityPersonalCard";
import {
  Center,
  Input,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { useState } from "react";

import { Activity, Registrant } from "@/types/model/activity";

type PersonalActivityDataProps = {
  activities: ({ activity: Activity } & Registrant)[];
};

export default function PersonalActivityData({
  activities,
}: PersonalActivityDataProps) {
  const [page, setPage] = useState(1);

  return (
    <Paper radius="md" withBorder p="lg">
      <Stack gap="md">
        <Input placeholder="Cari Kegiatan" />
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {activities
            .slice((page - 1) * 5, (page - 1) * 5 + 5)
            .map((activity) => (
              <ActivityPersonalCard
                key={activity.activity_id}
                activityName={activity.activity.name}
                slug={activity.activity.slug}
                registrationStatus={activity.status}
              />
            ))}
        </SimpleGrid>
        <Center>
          <Pagination
            total={Math.ceil(activities.length / 10)}
            onChange={setPage}
            value={page}
            siblings={0}
          />
        </Center>
      </Stack>
    </Paper>
  );
}
