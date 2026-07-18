"use client";

import { Center, Container, Skeleton, Text, Title } from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";
import gridClasses from "@/components/clubs/club-grid.module.css";

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

      <div className={`${gridClasses.grid} ${gridClasses.homeGrid}`}>
        <ClubGridSkeleton count={4} />
      </div>
      <Center>
        <Skeleton height={42} width={160} radius="md" mt="md" />
      </Center>
    </Container>
  );
}

export default ClubsSectionSkeleton;
