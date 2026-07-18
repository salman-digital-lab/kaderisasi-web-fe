import { Center, Group, Stack, Text, Title } from "@mantine/core";
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
import gridClasses from "./club-grid.module.css";

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
    return (
      <Stack gap="md">
        <Title order={2} size="h3">
          Daftar Klub
        </Title>
        <ClubsListError />
      </Stack>
    );
  }

  const { data: clubs, meta } = result;
  const totalPages = Math.max(meta.last_page || 1, 1);

  if (page > totalPages) {
    redirect(buildClubsHref({ search, clubType, page: totalPages }));
  }

  if (clubs.length === 0) {
    return (
      <Stack gap="md">
        <Group gap="xs" align="baseline">
          <Title order={2} size="h3">
            Daftar Klub
          </Title>
          <Text c="dimmed" size="sm">
            0 klub
          </Text>
        </Group>
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed" ta="center">
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
      </Stack>
    );
  }

  const firstResult = (page - 1) * meta.per_page + 1;
  const lastResult = firstResult + clubs.length - 1;

  return (
    <Stack gap="lg">
      <Group gap="xs" align="baseline">
        <Title order={2} size="h3">
          Daftar Klub
        </Title>
        <Text c="dimmed" size="sm">
          {firstResult}–{lastResult} dari {meta.total} klub
        </Text>
      </Group>

      <div className={gridClasses.grid}>
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
      </div>

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
