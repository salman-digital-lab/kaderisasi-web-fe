import Image from "next/image";
import {
  Container,
  Text,
  Button,
  Title,
  SimpleGrid,
  Stack,
  Center,
  TextInput,
} from "@mantine/core";
import classes from "./page.module.css";
import ClubCard from "../../../components/common/ClubCard";
import illustration from "@/assets/activitiespage-1.svg";
import Link from "next/link";
import { getClubs } from "../../../services/club";
import { IconSearch } from "@tabler/icons-react";

export const metadata = {
  title: "Klub & Komunitas",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClubsPage(props: Props) {
  const searchParams = await props.searchParams;
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search || "";

  // Request a very high number to get all clubs where is_show is true
  // The backend will filter by isShow: true and return all matching clubs
  // This ensures we display all available clubs instead of limiting to 12
  const { data: clubs } = await getClubs({
    page: "1",
    per_page: "9999", // High number to ensure we get all clubs
    search,
  });

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Klub & Komunitas{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md">
              Temukan berbagai klub dan komunitas yang ada di Kaderisasi Salman.
              Bergabunglah dengan komunitas yang sesuai dengan minat dan bakat
              Anda untuk mengembangkan potensi diri dan berkontribusi bagi
              sesama.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt="Klub & Komunitas Kaderisasi Salman"
            priority
            className={classes.image}
          />
        </div>
      </Container>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          <div>
            <Title ta="center" mt="sm">
              Jelajahi Klub & Komunitas
            </Title>
            <Text
              c="dimmed"
              className={classes.description_list}
              ta="center"
              mt="md"
              mb="xl"
            >
              Temukan komunitas yang tepat untuk mengembangkan minat dan bakat
              Anda. Setiap klub memiliki keunikan dan kontribusi tersendiri
              dalam membangun generasi pemimpin masa depan.
            </Text>
          </div>

          <Center>
            <form style={{ width: "100%", maxWidth: "400px" }}>
              <TextInput
                placeholder="Cari klub atau komunitas..."
                leftSection={<IconSearch size={16} />}
                name="search"
                defaultValue={search}
                radius="md"
                size="md"
              />
            </form>
          </Center>

          {clubs.length > 0 ? (
            <>
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
            </>
          ) : (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Text size="lg" c="dimmed">
                  {search
                    ? "Tidak ada klub yang ditemukan"
                    : "Belum ada klub yang tersedia"}
                </Text>
                {search && (
                  <Button component={Link} href="/clubs" variant="outline">
                    Lihat Semua Klub
                  </Button>
                )}
              </Stack>
            </Center>
          )}
        </Stack>
      </Container>
    </main>
  );
}
