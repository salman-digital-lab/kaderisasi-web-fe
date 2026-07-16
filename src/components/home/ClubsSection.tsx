import {
  SimpleGrid,
  Center,
  Title,
  Text,
  Container,
  Alert,
} from "@mantine/core";
import ClubCard from "@/components/common/ClubCard";
import LinkButton from "@/components/common/LinkButton";
import { getClubs } from "@/services/club";

export async function ClubsSection() {
  let clubs: Awaited<ReturnType<typeof getClubs>>["data"];

  try {
    ({ data: clubs } = await getClubs({ per_page: "4" }));
  } catch {
    return (
      <Container size="lg" py={{ base: "lg", md: "xl" }}>
        <Title order={2} ta="center" mt="sm">
          Unit Kegiatan dan Kepanitiaan
        </Title>
        <Alert color="yellow" title="Daftar club belum dapat dimuat" mt="xl">
          Silakan buka halaman Club atau coba lagi beberapa saat lagi.
        </Alert>
        <Center mt="lg">
          <LinkButton href="/clubs" variant="light">
            Buka halaman Club
          </LinkButton>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: "lg", md: "xl" }}>
      <Title order={2} ta="center" mt="sm">
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
                club_type={club.club_type}
                short_description={club.short_description}
                logo={club.logo}
                start_period={club.start_period}
                end_period={club.end_period}
                is_registration_open={Boolean(club.is_registration_open)}
                registration_end_date={club.registration_end_date}
              />
            ))}
          </SimpleGrid>
          {clubs.length > 3 && (
            <Center mt="lg">
              <LinkButton href="/clubs">
                Lihat Unit Lainnya
              </LinkButton>
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
