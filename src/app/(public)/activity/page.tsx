import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/layout/PageHero";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { Text } from "@mantine/core";
import illustration from "@/assets/activitiespage-1.svg";
import ActivityFilter from "@/features/activity/ActivityFilter";
import ActivityListContent from "@/components/activity/ActivityListContent";
import ActivityListSkeleton from "@/components/activity/ActivityListSkeleton";

export const metadata = {
  title: "Kegiatan",
  description:
    "Daftar kegiatan kaderisasi Salman meliputi pelatihan, keasramaan, dan pembinaan mahasiswa Islam. Temukan kegiatan yang sesuai dengan level dan minat Anda.",
};

type ActivityPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Page({
  searchParams,
}: ActivityPageProps): ReactElement {
  return (
    <>
      {/* Hero Section - Static content, renders immediately */}
      <PageHero
        title={
          <>
            Ayo Daftar Kegiatan di{" "}
            <Text component="span" c="blue" inherit>
              Kaderisasi Salman
            </Text>
          </>
        }
        description={
          <>
            Kegiatan di kaderisasi salman merupakan kegiatan yang diperuntukan
            untuk aktivis yang terdaftar menjadi kader salman. Kegiatan meliputi
            kegiatan kaderisasi, pelatihan, keasramaan dan lain-lain.
          </>
        }
        illustration={illustration}
      ></PageHero>

      <PageContainer>
        <Suspense fallback={<ActivityListSkeleton />}>
          <ActivityResults searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </>
  );
}

async function ActivityResults({
  searchParams,
}: ActivityPageProps): Promise<ReactElement> {
  const query = await searchParams;

  return (
    <>
      <ActivityFilter />
      <Suspense key={JSON.stringify(query)} fallback={<ActivityListSkeleton />}>
        <ActivityListContent searchParams={query} />
      </Suspense>
    </>
  );
}
