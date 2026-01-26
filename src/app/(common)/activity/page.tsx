import Image from "next/image";
import { Suspense } from "react";
import { Container, Text } from "@mantine/core";
import classes from "./index.module.css";
import illustration from "@/assets/activitiespage-1.svg";
import ActivityFilter from "@/features/activity/ActivityFilter";
import ActivityListContent from "@/components/activity/ActivityListContent";
import ActivityListSkeleton from "@/components/activity/ActivityListSkeleton";

export const metadata = {
  title: "Kegiatan",
  description:
    "Daftar kegiatan kaderisasi Salman meliputi pelatihan, keasramaan, dan pembinaan mahasiswa Islam. Temukan kegiatan yang sesuai dengan level dan minat Anda.",
};

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <main>
      {/* Hero Section - Static content, renders immediately */}
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Ayo Daftar Kegiatan di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
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
        {/* Filter - Client component, renders immediately */}
        <ActivityFilter />

        {/* Activity Grid - Streamed with Suspense */}
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<ActivityListSkeleton />}
        >
          <ActivityListContent searchParams={searchParams} />
        </Suspense>
      </Container>
    </main>
  );
}
