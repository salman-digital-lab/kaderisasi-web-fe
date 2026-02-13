import { SimpleGrid, Center, Text } from "@mantine/core";
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
      <Center mt={50} py="xl">
        <Text c="dimmed" size="lg">
          Tidak ada kegiatan
        </Text>
      </Center>
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
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

      <Center>
        <ActivityPagination total={activities.meta.last_page} />
      </Center>
    </>
  );
}

export default ActivityListContent;
