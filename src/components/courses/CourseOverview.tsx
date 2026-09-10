import {
  Badge,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import DetailBackLink from "@/components/layout/DetailBackLink";
import LinkButton from "@/components/common/LinkButton";
import RichTextContent from "@/components/common/RichTextContent";
import { readCourseData } from "@/services/course";
import {
  completionPercentage,
  courseHref,
  lessonHref,
  COURSE_LEVEL_LABELS,
} from "@/features/courses/paths";
import type { CourseDetail } from "@/types/api/course";
import LessonList from "./LessonList";

export default async function CourseOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactElement> {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) notFound();
  const course = await readCourseData<CourseDetail>(
    `/${id}`,
    courseHref(Number(id)),
  );
  const next = course.resume_lesson_id ?? course.lessons[0]?.id;
  return (
    <PageContainer size="md">
      <DetailBackLink href="/kelas">Semua kelas</DetailBackLink>
      <PageHeader title={course.title} description={course.summary} />
      <Stack gap="xl">
        <Group>
          <Badge variant="light">
            Jenjang minimum: {COURSE_LEVEL_LABELS[course.minimum_level]}
          </Badge>
          <Text>{course.total_lessons} materi</Text>
        </Group>
        {course.description && <RichTextContent html={course.description} />}
        <Paper withBorder radius="md" p="lg">
          <Stack gap="md">
            <Text aria-live="polite">
              {course.completed_lessons} dari {course.total_lessons} materi
              selesai
            </Text>
            <Progress
              value={completionPercentage(
                course.completed_lessons,
                course.total_lessons,
              )}
              aria-label="Progres kelas"
            />
            {next && (
              <LinkButton href={lessonHref(course.id, next)} mih={44}>
                {course.resume_lesson_id
                  ? "Lanjutkan belajar"
                  : "Mulai belajar"}
              </LinkButton>
            )}
          </Stack>
        </Paper>
        <section>
          <Title order={2} size="h3" mb="md">
            Materi kelas
          </Title>
          <LessonList courseId={course.id} lessons={course.lessons} />
        </section>
      </Stack>
    </PageContainer>
  );
}
