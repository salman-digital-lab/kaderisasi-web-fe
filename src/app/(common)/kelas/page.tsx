import { Suspense } from "react";
import type { ReactElement } from "react";
import CourseList from "@/components/courses/CourseList";
import CourseSkeleton from "@/components/courses/CourseSkeleton";

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
    <Suspense fallback={<CourseSkeleton />}>
      <CourseList searchParams={searchParams} />
    </Suspense>
  );
}
