import { Suspense } from "react";
import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
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
    <Container size="lg" py={{ base: "lg", md: "xl" }}>
      <Stack gap="xl">
        <header className={classes.header}>
          <Title order={1} className={classes.title}>
            Klub Kaderisasi Salman
          </Title>
          <Text className={classes.description}>
            Temukan klub UKM dan AVISMAN untuk bertumbuh, berkarya, dan
            berkolaborasi bersama.
          </Text>

          <div className={classes.controls}>
            <form action="/clubs" className={classes.searchForm}>
              <TextInput
                name="search"
                label="Cari klub"
                placeholder="Masukkan nama klub"
                defaultValue={search}
                maxLength={MAX_CLUB_SEARCH_LENGTH}
                leftSection={<IconSearch size={18} aria-hidden="true" />}
                className={classes.searchInput}
              />
              <input type="hidden" name="type" value={clubType || ""} />
              <Button type="submit" className={classes.searchButton}>
                Cari
              </Button>
            </form>
            <div
              className={classes.filters}
              role="group"
              aria-label="Filter jenis klub"
            >
              <LinkButton
                href={buildClubsHref({ search })}
                variant={!clubType ? "filled" : "default"}
                aria-current={!clubType ? "page" : undefined}
              >
                Semua
              </LinkButton>
              <LinkButton
                href={buildClubsHref({ search, clubType: "UKM" })}
                variant={clubType === "UKM" ? "filled" : "default"}
                aria-current={clubType === "UKM" ? "page" : undefined}
              >
                UKM
              </LinkButton>
              <LinkButton
                href={buildClubsHref({ search, clubType: "AVISMAN" })}
                variant={clubType === "AVISMAN" ? "filled" : "default"}
                aria-current={clubType === "AVISMAN" ? "page" : undefined}
              >
                AVISMAN
              </LinkButton>
            </div>
          </div>
        </header>

        <Suspense
          key={`${search}-${clubType || "ALL"}-${page}`}
          fallback={<ClubsListSkeleton />}
        >
          <ClubsListContent search={search} clubType={clubType} page={page} />
        </Suspense>
      </Stack>
    </Container>
  );
}
