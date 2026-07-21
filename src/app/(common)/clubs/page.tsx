import Image from "next/image";
import { Suspense } from "react";
import { Button, Container, Group, Text, TextInput } from "@mantine/core";
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

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const { search, clubType, page } = parseClubListQuery(await searchParams);

  return (
    <>
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
              Temukan ruang bertumbuh, berkarya, dan berkolaborasi melalui Unit,
              Club Keprofesian, Club Bahasa, dan Avisman Regional di Kaderisasi
              Salman.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt="Ilustrasi klub Kaderisasi Salman"
            priority
            className={classes.image}
            sizes="(max-width: 992px) 0px, 376px"
          />
        </div>
      </Container>

      <Container size="lg" py="xl">
        <form action="/clubs" className={classes.searchForm}>
          <TextInput
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
        </form>

        <Group
          mt="md"
          gap="xs"
          justify="center"
          role="group"
          aria-label="Filter jenis klub"
        >
          <LinkButton
            href={buildClubsHref({ search })}
            variant={!clubType ? "filled" : "light"}
            radius="xs"
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
              radius="xs"
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
      </Container>
    </>
  );
}
