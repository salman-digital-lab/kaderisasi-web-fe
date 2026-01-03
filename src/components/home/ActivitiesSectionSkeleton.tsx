"use client";

import { SimpleGrid, Title, Text, Container, Skeleton, Center } from "@mantine/core";
import { ActivityGridSkeleton } from "@/components/skeletons";

export function ActivitiesSectionSkeleton() {
  return (
    <Container size="lg" py="xl">
      <Title ta="center" mt="sm">
        Kegiatan Baru
      </Title>

      <Text
        c="dimmed"
        ta="center"
        mt="md"
        maw={600}
        mx="auto"
      >
        Jelajahi dan saksikan peluang kegiatan yang dapat membantu Anda
        mengasah potensi dan kontribusi unik Anda dalam lingkungan yang
        mendukung.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
        <ActivityGridSkeleton count={4} />
      </SimpleGrid>
      <Center>
        <Skeleton height={42} width={180} radius="md" mt="md" />
      </Center>
    </Container>
  );
}

export default ActivitiesSectionSkeleton;

