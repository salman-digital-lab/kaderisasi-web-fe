import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/layout/PageHero";
import type { ReactElement } from "react";
import { Suspense } from "react";
import { Text } from "@mantine/core";
import illustration from "@/assets/clubspage-1.svg";
import ClubsListContent from "@/components/clubs/ClubsListContent";
import ClubsListSkeleton from "@/components/clubs/ClubsListSkeleton";
import CatalogueFilters from "@/components/common/Catalogue/CatalogueFilters";
import {
  buildClubsHref,
  MAX_CLUB_SEARCH_LENGTH,
  parseClubListQuery,
} from "@/features/clubs/list-query";
import { CLUB_TYPES, CLUB_TYPE_LABELS } from "@/types/model/club";

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
      <CatalogueFilters
        action="/clubs"
        search={search}
        searchLabel="Cari klub"
        maxLength={MAX_CLUB_SEARCH_LENGTH}
        filterLabel="Filter jenis klub"
        filterName="type"
        filterValue={clubType || ""}
        options={[
          {
            label: "Semua",
            href: buildClubsHref({ search }),
            active: !clubType,
          },
          ...CLUB_TYPES.map((type) => ({
            label: CLUB_TYPE_LABELS[type],
            href: buildClubsHref({ search, clubType: type }),
            active: clubType === type,
          })),
        ]}
      />

      <Suspense
        key={`${search}-${clubType || "ALL"}-${page}`}
        fallback={<ClubsListSkeleton />}
      >
        <ClubsListContent search={search} clubType={clubType} page={page} />
      </Suspense>
    </>
  );
}
