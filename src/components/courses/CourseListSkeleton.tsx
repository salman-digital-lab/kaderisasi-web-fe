import { Card, Group, SimpleGrid, Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";

export default function CourseListSkeleton(): ReactElement {
  return (
    <Stack
      gap="xl"
      role="status"
      aria-label="Memuat daftar kelas"
      aria-busy="true"
    >
      <Group wrap="nowrap" aria-hidden>
        <Skeleton h={44} style={{ flex: 1 }} radius="md" />
        <Skeleton h={44} w={80} radius="md" />
      </Group>
      <Skeleton h={20} w={180} />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" aria-hidden>
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} withBorder radius="md" p="md">
            <Stack gap="md">
              <Skeleton h={24} w="80%" />
              <Skeleton h={54} />
              <Skeleton h={22} w="60%" />
              <Skeleton h={72} />
              <Skeleton h={44} radius="md" />
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
