import Image from "next/image";
import { Suspense } from "react";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import illustration from "@/assets/activitiespage-1.svg";
import ClubsListContent from "@/components/clubs/ClubsListContent";
import ClubsListSkeleton from "@/components/clubs/ClubsListSkeleton";
import LinkButton from "@/components/common/LinkButton";
import {
  buildClubsHref,
  MAX_CLUB_SEARCH_LENGTH,
  parseClubListQuery,
} from "@/features/clubs/list-query";
import classes from "./page.module.css";

export const metadata = {
  title: "Klub",
  description: "Daftar klub UKM dan AVISMAN di lingkungan Kaderisasi Salman.",
};

type ClubsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const { search, clubType, page } = parseClubListQuery(await searchParams);

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Klub di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
              Temukan ruang bertumbuh, berkarya, dan berkolaborasi melalui klub
              UKM dan AVISMAN di Kaderisasi Salman.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt=""
            preload
            className={classes.image}
          />
        </div>
      </Container>

      <Container size="lg" py={{ base: "lg", md: "xl" }}>
        <Stack gap="lg">
          <Stack gap="xs" align="center">
            <Title order={2} ta="center" className={classes.sectionTitle}>
              Jelajahi Klub
            </Title>
            <Text
              c="dimmed"
              maw={640}
              ta="center"
              className={classes.sectionDescription}
            >
              Cari klub berdasarkan nama atau pilih jenis klub yang ingin Anda
              jelajahi.
            </Text>
          </Stack>

          <Stack gap="md" align="center">
            <form action="/clubs" className={classes.searchForm}>
              <TextInput
                name="search"
                label="Cari klub"
                placeholder="Nama klub"
                defaultValue={search}
                maxLength={MAX_CLUB_SEARCH_LENGTH}
                leftSection={<IconSearch size={16} aria-hidden="true" />}
                className={classes.searchInput}
              />
              <input type="hidden" name="type" value={clubType || ""} />
              <Button type="submit" className={classes.searchButton}>
                Cari
              </Button>
            </form>
            <Group
              gap="xs"
              justify="center"
              role="group"
              aria-label="Filter jenis klub"
            >
              <LinkButton
                href={buildClubsHref({ search })}
                variant={!clubType ? "filled" : "light"}
                size="sm"
                aria-current={!clubType ? "page" : undefined}
              >
                Semua
              </LinkButton>
              <LinkButton
                href={buildClubsHref({ search, clubType: "UKM" })}
                variant={clubType === "UKM" ? "filled" : "light"}
                size="sm"
                aria-current={clubType === "UKM" ? "page" : undefined}
              >
                UKM
              </LinkButton>
              <LinkButton
                href={buildClubsHref({ search, clubType: "AVISMAN" })}
                variant={clubType === "AVISMAN" ? "filled" : "light"}
                size="sm"
                aria-current={clubType === "AVISMAN" ? "page" : undefined}
              >
                AVISMAN
              </LinkButton>
            </Group>
          </Stack>

          <Suspense
            key={`${search}-${clubType || "ALL"}-${page}`}
            fallback={<ClubsListSkeleton />}
          >
            <ClubsListContent search={search} clubType={clubType} page={page} />
          </Suspense>
        </Stack>
      </Container>
    </main>
  );
}
