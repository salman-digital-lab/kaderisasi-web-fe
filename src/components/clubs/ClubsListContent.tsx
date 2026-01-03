import { SimpleGrid, Center, Stack, Text, Button } from "@mantine/core";
import Link from "next/link";
import ClubCard from "@/components/common/ClubCard";
import { getClubs } from "@/services/club";

type ClubsListContentProps = {
  search: string;
};

export async function ClubsListContent({ search }: ClubsListContentProps) {
  const { data: clubs } = await getClubs({
    page: "1",
    per_page: "9999",
    search,
  });

  if (clubs.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            {search
              ? "Tidak ada unit kegiatan atau kepanitiaan yang ditemukan"
              : "Belum ada unit kegiatan atau kepanitiaan yang tersedia"}
          </Text>
          {search && (
            <Link href="/clubs" style={{ textDecoration: "none" }}>
              <Button variant="outline">
                Lihat Semua Unit Kegiatan & Kepanitiaan
              </Button>
            </Link>
          )}
        </Stack>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          id={club.id}
          name={club.name}
          short_description={club.short_description}
          logo={club.logo}
          start_period={club.start_period}
          end_period={club.end_period}
        />
      ))}
    </SimpleGrid>
  );
}

export default ClubsListContent;

