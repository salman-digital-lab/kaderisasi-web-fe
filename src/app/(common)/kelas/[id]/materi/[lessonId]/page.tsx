import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import LessonContent from "@/components/courses/LessonContent";
import { readCourseData } from "@/services/course";
import { lessonHref } from "@/features/courses/paths";
import type { LessonDetail } from "@/types/api/course";

type Props = { params: Promise<{ id: string; lessonId: string }> };
export const metadata = {
  title: "Materi Kelas",
  robots: { index: false, follow: false },
};
async function Lesson({ params }: Props): Promise<ReactElement> {
  const { id, lessonId } = await params;
  if (
    ![id, lessonId].every(
      (value) => /^[1-9]\d*$/.test(value) && Number(value) <= 2147483647,
    )
  )
    notFound();
  const data = await readCourseData<LessonDetail>(
    `/${id}/lessons/${lessonId}`,
    lessonHref(Number(id), Number(lessonId)),
  );
  return <LessonContent key={`${id}/${lessonId}`} data={data} />;
}
export default function LessonPage(props: Props): ReactElement {
  return (
    <Suspense fallback={<CourseSkeleton />}>
      <Lesson {...props} />
    </Suspense>
  );
}
