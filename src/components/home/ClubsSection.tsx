import {
  SimpleGrid,
  Center,
  Button,
  Title,
  Text,
  Container,
} from "@mantine/core";
import Link from "next/link";
import ClubCard from "@/components/common/ClubCard";
import { getClubs } from "@/services/club.cache";

export async function ClubsSection() {
  const { data: clubs } = await getClubs({ per_page: "4" });

  return (
    <Container size="lg" py={{ base: "lg", md: "xl" }}>
      <Title ta="center" mt="sm">
        Unit Kegiatan dan Kepanitiaan
      </Title>

      <Text c="dimmed" ta="center" mt="md" maw={600} mx="auto">
        Bergabunglah dengan berbagai unit kegiatan dan kepanitiaan untuk
        mengembangkan minat dan bakat Anda serta berkontribusi dalam membangun
        generasi pemimpin masa depan.
      </Text>

      {clubs.length > 0 ? (
        <>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: "lg", md: "md" }}
            mt={{ base: "xl", md: 50 }}
          >
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
          {clubs.length > 3 && (
            <Center mt="lg">
              <Link href="/clubs" style={{ textDecoration: "none" }}>
                <Button>
                  Lihat Unit Lainnya
                </Button>
              </Link>
            </Center>
          )}
        </>
      ) : (
        <Center py="xl">
          <Text size="lg" c="dimmed">
            Belum ada unit yang tersedia
          </Text>
        </Center>
      )}
    </Container>
  );
}

export default ClubsSection;
