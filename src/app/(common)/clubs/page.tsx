import Image from "next/image";
import {
  Container,
  Text,
  Button,
  Group,
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
  const page = Array.isArray(searchParams.page) 
    ? searchParams.page[0] 
    : searchParams.page || "1";
  const search = Array.isArray(searchParams.search) 
    ? searchParams.search[0] 
    : searchParams.search || "";

  const { data: clubs } = await getClubs({ 
    page,
    per_page: "12",
    search,
  });

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Klub &{" "}
              <Text component="span" c="blue" inherit>
                Komunitas
              </Text>{" "}
              Kaderisasi Salman
            </h1>
            <Text c="dimmed" mt="md">
              Temukan berbagai klub dan komunitas yang ada di Kaderisasi Salman. 
              Bergabunglah dengan komunitas yang sesuai dengan minat dan bakat Anda 
              untuk mengembangkan potensi diri dan berkontribusi bagi sesama.
            </Text>

            <Group mt={30}>
              <Button size="md" component={Link} href="/activity">
                Lihat Kegiatan Klub
              </Button>
            </Group>
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
              Temukan komunitas yang tepat untuk mengembangkan minat dan bakat Anda. 
              Setiap klub memiliki keunikan dan kontribusi tersendiri dalam membangun 
              generasi pemimpin masa depan.
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
                    logo={club.logo}
                    startPeriod={club.startPeriod}
                    endPeriod={club.endPeriod}
                  />
                ))}
              </SimpleGrid>
              
              {clubs.length === 12 && (
                <Center>
                  <Button variant="outline" size="md">
                    Muat Lebih Banyak
                  </Button>
                </Center>
              )}
            </>
          ) : (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Text size="lg" c="dimmed">
                  {search ? "Tidak ada klub yang ditemukan" : "Belum ada klub yang tersedia"}
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
