import Image from "next/image";
import { Container, Text, SimpleGrid, Pagination, Center } from "@mantine/core";
import classes from "./index.module.css";
import ActivityCard from "../../../components/common/ActivityCard";
import illustration from "@/assets/activitiespage-1.svg";
import ActivityFilter from "../../../features/activity/ActivityFilter";
import { getActivities } from "../../../services/activity";
import ActivityPagination from "../../../features/activity/ActivityPagination";

export default async function Page(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const activities = await getActivities({ per_page: "8", ...searchParams });

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Ayo Daftar Kegiatan di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md">
              Kegiatan di kaderisasi salman merupakan kegiatan yang diperuntukan
              untuk aktivis yang terdaftar menjadi kader salman. Kegiatan
              meliputi kegiatan kaderisasi, pelatihan, keasramaan dan lain-lain.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt="Selamat Datang di BMKA Salman ITB"
            priority
            className={classes.image}
          />
        </div>
      </Container>

      <Container size="lg" py="xl">
        <ActivityFilter />
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
          {activities?.data.map((activity) => (
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
      </Container>
    </main>
  );
}
