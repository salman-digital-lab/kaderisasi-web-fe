import { SimpleGrid, Center, Button, Title, Text, Container } from "@mantine/core";
import Link from "next/link";
import ActivityCard from "@/components/common/ActivityCard";
import { getActivities } from "@/services/activity";

export async function ActivitiesSection() {
  const { data: activities } = await getActivities({ per_page: "4" });

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mt="sm">
        Kegiatan Baru
      </Title>

      <Text
        c="dimmed"
        ta="center"
        mt="md"
        maw={600}
        mx="auto"
      >
        Jelajahi dan saksikan peluang kegiatan yang dapat membantu Anda
        mengasah potensi dan kontribusi unik Anda dalam lingkungan yang
        mendukung.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
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
        <Center>
          <Link href="/activity" style={{ textDecoration: "none" }}>
            <Button size="md" mt="md">
              Lihat Kegiatan Lainnya
            </Button>
          </Link>
        </Center>
      )}
    </Container>
  );
}

export default ActivitiesSection;

