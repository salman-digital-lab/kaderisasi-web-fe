import {
  SimpleGrid,
  Center,
  Title,
  Text,
  Container,
  Card,
} from "@mantine/core";
import LinkButton from "@/components/common/LinkButton";
import ActivityCard from "@/components/common/ActivityCard";
import { getActivities } from "@/services/activity.cache";

export async function ActivitiesSection() {
  const { data: activities } = await getActivities({ per_page: "4" });

  return (
    <Container size="lg" py="var(--page-space)">
      <Title ta="center" mt="sm">
        Kegiatan Baru
      </Title>

      <Text c="dimmed" ta="center" mt="md" maw={600} mx="auto">
        Jelajahi dan saksikan peluang kegiatan yang dapat membantu Anda mengasah
        potensi dan kontribusi unik Anda dalam lingkungan yang mendukung.
      </Text>

      {activities.length > 0 ? (
        <>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: "lg", md: "md" }}
            mt="xl"
          >
            {activities.map((activity) => (
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
          {activities.length > 3 && (
            <Center mt="lg">
              <LinkButton href="/activity">Lihat Kegiatan Lainnya</LinkButton>
            </Center>
          )}
        </>
      ) : (
        <Card
          padding="xl"
          radius="md"
          withBorder
          mt="xl"
          w="fit-content"
          mx="auto"
        >
          <Text ta="center" c="dimmed" fz="md">
            Belum ada kegiatan baru saat ini. Nantikan kegiatan menarik dari
            kami!
          </Text>
        </Card>
      )}
    </Container>
  );
}

export default ActivitiesSection;
