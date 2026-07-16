import { SimpleGrid, Center, Stack, Text, Group } from "@mantine/core";
import { redirect } from "next/navigation";
import ClubCard from "@/components/common/ClubCard";
import { getClubs } from "@/services/club.cache";
import ClubPagination from "./ClubPagination";
import ClubsListError from "./ClubsListError";
import LinkButton from "@/components/common/LinkButton";
import {
  buildClubsHref,
  CLUBS_PAGE_SIZE,
  type ClubListQuery,
} from "@/features/clubs/list-query";

type ClubsListContentProps = ClubListQuery;

export async function ClubsListContent({
  search,
  clubType,
  page,
}: ClubsListContentProps) {
  let result: Awaited<ReturnType<typeof getClubs>>;

  try {
    result = await getClubs({
      page: String(page),
      per_page: String(CLUBS_PAGE_SIZE),
      search,
      club_type: clubType,
    });
  } catch {
    return <ClubsListError />;
  }

  const { data: clubs, meta } = result;
  const totalPages = Math.max(meta.last_page || 1, 1);

  if (page > totalPages) {
    redirect(buildClubsHref({ search, clubType, page: totalPages }));
  }

  if (clubs.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            {search || clubType
              ? "Tidak ada klub yang sesuai dengan pencarian atau filter Anda."
              : "Belum ada klub yang tersedia."}
          </Text>
          {(search || clubType) && (
            <LinkButton href="/clubs" variant="outline">
              Hapus pencarian dan filter
            </LinkButton>
          )}
        </Stack>
      </Center>
    );
  }

  const firstResult = (page - 1) * meta.per_page + 1;
  const lastResult = firstResult + clubs.length - 1;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Text c="dimmed" size="md">
          Menampilkan {firstResult}–{lastResult} dari {meta.total} klub
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
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

      <ClubPagination
        search={search}
        clubType={clubType}
        page={page}
        totalPages={totalPages}
      />
    </Stack>
  );
}

export default ClubsListContent;
