import Image from "next/image";
import { Suspense } from "react";
import {
  Container,
  Text,
  Title,
  Stack,
  Center,
  TextInput,
} from "@mantine/core";
import classes from "./page.module.css";
import illustration from "@/assets/activitiespage-1.svg";
import { IconSearch } from "@tabler/icons-react";
import ClubsListContent from "@/components/clubs/ClubsListContent";
import ClubsListSkeleton from "@/components/clubs/ClubsListSkeleton";

export const metadata = {
  title: "Unit Kegiatan & Kepanitiaan",
  description:
    "Jelajahi Unit Kegiatan dan Kepanitiaan di Kaderisasi Salman. Bergabung dengan komunitas yang sesuai minat dan bakat untuk mengembangkan potensi diri.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClubsPage(props: Props) {
  const searchParams = await props.searchParams;
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search || "";

  return (
    <main>
      {/* Hero Section - Static content, renders immediately */}
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Unit Kegiatan dan Kepanitiaan di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
              Ayo bergabung dengan Unit yang sesuai dengan minat dan bakat kamu,
              untuk mengembangkan potensi diri dan berkontribusi bagi sesama.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt=" Unit Kegiatan dan Unit Kepanitiaan Kaderisasi Salman"
            priority
            className={classes.image}
          />
        </div>
      </Container>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header - Static content */}
          <div>
            <Title ta="center" mt="sm" className={classes.sectionTitle}>
              Jelajahi Unit Kegiatan dan Kepanitiaan
            </Title>
            <Text
              c="dimmed"
              className={`${classes.description_list} ${classes.sectionDescription}`}
              ta="center"
              mt="md"
              mb="xl"
            >
              Temukan komunitas yang tepat untuk mengembangkan minat dan bakat
              Anda. Setiap unit memiliki keunikan dan kontribusi tersendiri
              dalam membangun generasi pemimpin masa depan.
            </Text>
          </div>

          {/* Search - Client component, renders immediately */}
          <Center>
            <form style={{ width: "100%", maxWidth: "400px" }}>
              <TextInput
                placeholder="Cari unit kegiatan atau kepanitiaan..."
                leftSection={<IconSearch size={16} />}
                name="search"
                defaultValue={search}
                radius="md"
                size="md"
              />
            </form>
          </Center>

          {/* Clubs Grid - Streamed with Suspense */}
          <Suspense key={search} fallback={<ClubsListSkeleton />}>
            <ClubsListContent search={search} />
          </Suspense>
        </Stack>
      </Container>
    </main>
  );
}
