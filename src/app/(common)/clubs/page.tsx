import { Suspense } from "react";
import {
  Button,
  Container,
  Group,
  Paper,
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

export const metadata = {
  title: "Club",
  description: "Daftar UKM dan AVISMAN di lingkungan Kaderisasi Salman.",
};

type ClubsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const { search, clubType, page } = parseClubListQuery(await searchParams);

  return (
    <div>
      <Container size="lg" py={{ base: "lg", md: "xl" }}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={1}>Club</Title>
            <Text c="dimmed" maw={720}>
              Jelajahi UKM dan AVISMAN yang tersedia di Kaderisasi Salman.
            </Text>
          </Stack>

          <Paper withBorder p="md" radius="md">
            <form action="/clubs">
              <Group align="end" gap="md">
                <TextInput
                  name="search"
                  label="Cari club"
                  placeholder="Nama club"
                  defaultValue={search}
                  maxLength={MAX_CLUB_SEARCH_LENGTH}
                  leftSection={<IconSearch size={16} aria-hidden="true" />}
                  style={{ flex: 1, minWidth: 220 }}
                />
                <input type="hidden" name="type" value={clubType || ""} />
                <Button type="submit">Cari</Button>
              </Group>
            </form>
            <Group mt="md" gap="xs" role="group" aria-label="Filter jenis club">
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
          </Paper>

          <Suspense
            key={`${search}-${clubType || "ALL"}-${page}`}
            fallback={<ClubsListSkeleton />}
          >
            <ClubsListContent search={search} clubType={clubType} page={page} />
          </Suspense>
        </Stack>
      </Container>
    </div>
  );
}
