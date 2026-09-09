import LinkButton from "@/components/common/LinkButton";
import { SimpleGrid, Center, Text, Stack } from "@mantine/core";
import ActivityCard from "@/components/common/ActivityCard";
import ActivityPagination from "@/features/activity/ActivityPagination";
import { getActivities } from "@/services/activity.cache";

type ActivityListContentProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function ActivityListContent({
  searchParams,
}: ActivityListContentProps) {
  const activities = await getActivities({ per_page: "8", ...searchParams });

  if (!activities?.data?.length) {
    return (
      <Center mt="xl" py="xl">
        <Stack align="center" gap="md">
          <Text c="dimmed" size="lg" ta="center">
            Tidak ada kegiatan yang sesuai.
          </Text>
          {(searchParams.search || searchParams.category) && (
            <LinkButton href="/activity" variant="outline">
              Hapus pencarian dan filter
            </LinkButton>
          )}
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
        {activities.data.map((activity) => (
          <ActivityCard
            key={activity.id}
            activityName={activity.name}
            minimumLevel={activity.minimum_level}
            registrationEnd={activity.registration_end}
            slug={activity.slug}
            imageUrl={
              activity.additional_config?.images?.length &&
              activity.additional_config?.images?.length > 0
                ? activity.additional_config.images[0]
                : undefined
            }
          />
        ))}
      </SimpleGrid>

      <Center mt="xl">
        <ActivityPagination
          total={activities.meta.last_page}
          current={activities.meta.current_page}
        />
      </Center>
    </>
  );
}

export default ActivityListContent;
