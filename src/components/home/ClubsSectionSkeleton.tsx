"use client";

import { SimpleGrid, Title, Text, Container, Skeleton, Center } from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";

export function ClubsSectionSkeleton() {
  return (
    <Container size="lg" py="xl">
      <Title ta="center" mt="sm">
        Unit Kegiatan dan Kepanitiaan
      </Title>

      <Text
        c="dimmed"
        ta="center"
        mt="md"
        maw={600}
        mx="auto"
      >
        Bergabunglah dengan berbagai unit kegiatan dan kepanitiaan untuk
        mengembangkan minat dan bakat Anda serta berkontribusi dalam membangun
        generasi pemimpin masa depan.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
        <ClubGridSkeleton count={4} />
      </SimpleGrid>
      <Center>
        <Skeleton height={42} width={160} radius="md" mt="md" />
      </Center>
    </Container>
  );
}

export default ClubsSectionSkeleton;

