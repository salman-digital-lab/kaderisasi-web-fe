import {
  Badge,
  Group,
  ProgressRoot,
  ProgressSection,
  Stack,
  Text,
} from "@mantine/core";
import type { ReactElement } from "react";
import CatalogueCard, {
  CatalogueCardSection,
} from "@/components/common/Catalogue/CatalogueCard";
import {
  completionPercentage,
  courseHref,
  COURSE_LEVEL_LABELS,
} from "@/features/courses/paths";
import type { CourseSummary } from "@/types/api/course";

export default function CourseCard({
  course,
}: {
  course: CourseSummary;
}): ReactElement {
  const percentage = completionPercentage(
    course.completed_lessons,
    course.total_lessons,
  );
  const status =
    course.total_lessons > 0 && course.completed_lessons >= course.total_lessons
      ? "Selesai"
      : course.resume_lesson_id
        ? "Sedang dipelajari"
        : "Belum dimulai";
  return (
    <CatalogueCard
      title={course.title}
      description={course.summary}
      href={courseHref(course.id)}
      linkLabel={`Buka kelas ${course.title}`}
      actionLabel="Buka kelas"
    >
      <CatalogueCardSection label="Jenjang minimum">
        <Badge variant="light">
          {COURSE_LEVEL_LABELS[course.minimum_level]}
        </Badge>
      </CatalogueCardSection>
      <CatalogueCardSection label="Progres Anda">
        <Stack gap="xs" w="100%">
          <Group justify="space-between" gap="xs">
            <Text size="sm" fw={500}>
              {status}
            </Text>
            <Text size="sm" c="dimmed">
              {percentage}%
            </Text>
          </Group>
          <ProgressRoot size="sm">
            <ProgressSection
              value={percentage}
              aria-label={`Progres ${course.title}`}
              aria-valuetext={`${course.completed_lessons} dari ${course.total_lessons} materi selesai`}
            />
          </ProgressRoot>
          <Text size="sm" c="dimmed">
            {course.completed_lessons} dari {course.total_lessons} materi
            selesai
          </Text>
        </Stack>
      </CatalogueCardSection>
    </CatalogueCard>
  );
}
