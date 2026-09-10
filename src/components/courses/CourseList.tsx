import {
  Badge,
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import LinkButton from "@/components/common/LinkButton";
import CataloguePagination from "@/components/common/Catalogue/CataloguePagination";
import { readCourseData } from "@/services/course";
import {
  completionPercentage,
  courseHref,
  courseListHref,
  COURSE_LEVEL_LABELS,
} from "@/features/courses/paths";
import type { CoursePage } from "@/types/api/course";
import classes from "./Courses.module.css";

export default async function CourseList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<ReactElement> {
  const params = await searchParams;
  const search =
    typeof params.search === "string" ? params.search.slice(0, 200).trim() : "";
  const page =
    typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
      ? Math.min(Number(params.page), 1000000)
      : 1;
  const query = new URLSearchParams({
    search,
    page: String(page),
    per_page: "12",
  });
  const courses = await readCourseData<CoursePage>(
    `?${query}`,
    courseListHref(search, page),
  );
  return (
    <PageContainer>
      <PageHeader
        title="Kelas"
        description="Pelajari materi sesuai jenjang Anda dan lanjutkan dari progres terakhir."
      />
      <Stack gap="xl">
        <form action="/kelas">
          <Group align="end">
            <TextInput
              name="search"
              label="Cari kelas"
              placeholder="Judul kelas"
              defaultValue={search}
              maxLength={200}
              style={{ flex: 1 }}
            />
            <Button type="submit" mih={44}>
              Cari
            </Button>
          </Group>
        </form>
        {courses.data.length ? (
          <div className={classes.grid}>
            {courses.data.map((course) => (
              <Paper
                component="article"
                key={course.id}
                withBorder
                radius="md"
                p="lg"
                className={classes.card}
              >
                <Badge variant="light">
                  {COURSE_LEVEL_LABELS[course.minimum_level]}
                </Badge>
                <Title order={2} size="h3">
                  {course.title}
                </Title>
                {course.summary && (
                  <Text c="dimmed" lineClamp={3}>
                    {course.summary}
                  </Text>
                )}
                <Text size="sm">
                  {course.completed_lessons} dari {course.total_lessons} materi
                  selesai
                </Text>
                <Progress
                  value={completionPercentage(
                    course.completed_lessons,
                    course.total_lessons,
                  )}
                  aria-label={`Progres ${course.title}`}
                />
                <div className={classes.cardAction}>
                  <LinkButton href={courseHref(course.id)} fullWidth mih={44}>
                    Buka kelas
                  </LinkButton>
                </div>
              </Paper>
            ))}
          </div>
        ) : (
          <Paper withBorder radius="md" p="xl">
            <Stack gap="sm">
              <Title order={2} size="h3">
                {search
                  ? "Kelas tidak ditemukan"
                  : "Belum ada kelas untuk Anda"}
              </Title>
              <Text c="dimmed">
                {search
                  ? "Coba judul lain atau tampilkan semua kelas."
                  : "Kelas yang tersedia untuk jenjang Anda akan muncul di sini."}
              </Text>
              {(search || page > 1) && (
                <LinkButton href="/kelas" variant="light">
                  Tampilkan semua kelas
                </LinkButton>
              )}
            </Stack>
          </Paper>
        )}
        <CataloguePagination
          label="Halaman kelas"
          page={page}
          totalPages={courses.meta.last_page}
          hrefForPage={(next) => courseListHref(search, next)}
        />
      </Stack>
    </PageContainer>
  );
}
