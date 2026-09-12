import { Suspense } from "react";
import type { ReactElement } from "react";
import { Text } from "@mantine/core";
import illustration from "@/assets/kelaspage-1.svg";
import PageHero from "@/components/layout/PageHero";
import PageContainer from "@/components/layout/PageContainer";
import CourseList from "@/components/courses/CourseList";
import CourseListSkeleton from "@/components/courses/CourseListSkeleton";

export const metadata = {
  title: "Kelas",
  robots: { index: false, follow: false },
};
export default function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): ReactElement {
  return (
    <>
      <PageHero
        title={
          <>
            Kelas di{" "}
            <Text component="span" c="blue" inherit>
              Kaderisasi Salman
            </Text>
          </>
        }
        description="Belajar melalui video dan bahan bacaan sesuai jenjang Anda. Pilih kelas, pelajari setiap materi, dan lanjutkan dari progres terakhir."
        illustration={illustration}
      />
      <PageContainer>
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseList searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </>
  );
}
