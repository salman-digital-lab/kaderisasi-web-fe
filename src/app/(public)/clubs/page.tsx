import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/layout/PageHero";
import Form from "next/form";
import type { ReactElement } from "react";
import { Suspense } from "react";
import { Button, Group, Text, TextInput } from "@mantine/core";
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
import { CLUB_TYPES, CLUB_TYPE_LABELS } from "@/types/model/club";
import classes from "./page.module.css";

export const metadata = {
  title: "Klub",
  description:
    "Daftar Unit, Club Keprofesian, Club Bahasa, dan Avisman Regional di Kaderisasi Salman.",
};

type ClubsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function ClubsPage({
  searchParams,
}: ClubsPageProps): ReactElement {
  return (
    <>
      <PageHero
        title={
          <>
            Klub di{" "}
            <Text component="span" c="blue" inherit>
              Kaderisasi Salman
            </Text>
          </>
        }
        description={
          <>
            Temukan ruang bertumbuh, berkarya, dan berkolaborasi melalui Unit,
            Club Keprofesian, Club Bahasa, dan Avisman Regional di Kaderisasi
            Salman.
          </>
        }
        illustration={illustration}
      ></PageHero>

      <PageContainer>
        <Suspense fallback={<ClubsListSkeleton />}>
          <ClubsBrowser searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </>
  );
}

async function ClubsBrowser({
  searchParams,
}: ClubsPageProps): Promise<ReactElement> {
  const { search, clubType, page } = parseClubListQuery(await searchParams);

  return (
    <>
      <Form action="/clubs" className={classes.searchForm}>
        <TextInput
          key={search}
          name="search"
          aria-label="Cari klub"
          size="md"
          placeholder="Cari Klub"
          defaultValue={search}
          maxLength={MAX_CLUB_SEARCH_LENGTH}
          leftSection={<IconSearch size={18} aria-hidden="true" />}
          className={classes.searchInput}
        />
        <input type="hidden" name="type" value={clubType || ""} />
        <Button type="submit" size="md" className={classes.searchButton}>
          Cari
        </Button>
      </Form>

      <Group
        mt="md"
        gap="xs"
        justify="flex-start"
        role="group"
        aria-label="Filter jenis klub"
      >
        <LinkButton
          href={buildClubsHref({ search })}
          variant={!clubType ? "filled" : "light"}
          color={!clubType ? undefined : "gray"}
          radius="md"
          size="md"
          mih={44}
          aria-current={!clubType ? "page" : undefined}
        >
          Semua
        </LinkButton>
        {CLUB_TYPES.map((type) => (
          <LinkButton
            key={type}
            href={buildClubsHref({ search, clubType: type })}
            variant={clubType === type ? "filled" : "light"}
            color={clubType === type ? undefined : "gray"}
            radius="md"
            size="md"
            mih={44}
            aria-current={clubType === type ? "page" : undefined}
          >
            {CLUB_TYPE_LABELS[type]}
          </LinkButton>
        ))}
      </Group>

      <Suspense
        key={`${search}-${clubType || "ALL"}-${page}`}
        fallback={<ClubsListSkeleton />}
      >
        <ClubsListContent search={search} clubType={clubType} page={page} />
      </Suspense>
    </>
  );
}
