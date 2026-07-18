"use client";

import {
  Center,
  Container,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";

export function ClubsSectionSkeleton() {
  return (
    <Container size="lg" py="xl">
      <Title ta="center" mt="sm">
        Klub dan Kepanitiaan
      </Title>

      <Text c="dimmed" ta="center" mt="md" maw={600} mx="auto">
        Bergabunglah dengan berbagai klub dan kepanitiaan untuk mengembangkan
        minat dan bakat Anda serta berkontribusi dalam membangun generasi
        pemimpin masa depan.
      </Text>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 4 }}
        spacing={{ base: "lg", md: "md" }}
        mt={{ base: "xl", md: 50 }}
      >
        <ClubGridSkeleton count={4} />
      </SimpleGrid>
      <Center>
        <Skeleton height={42} width={160} radius="md" mt="md" />
      </Center>
    </Container>
  );
}

export default ClubsSectionSkeleton;
