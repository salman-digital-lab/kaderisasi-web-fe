import { Suspense } from "react";
import type { ReactElement } from "react";
import CourseOverview from "@/components/courses/CourseOverview";
import CourseSkeleton from "@/components/courses/CourseSkeleton";

export const metadata = {
  title: "Kelas",
  robots: { index: false, follow: false },
};
export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): ReactElement {
  return (
    <Suspense fallback={<CourseSkeleton />}>
      <CourseOverview params={params} />
    </Suspense>
  );
}
