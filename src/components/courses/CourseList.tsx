import { Center, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import CatalogueSearch from "@/components/common/Catalogue/CatalogueSearch";
import CataloguePagination from "@/components/common/Catalogue/CataloguePagination";
import { readCourseData } from "@/services/course";
import { courseListHref } from "@/features/courses/paths";
import type { CoursePage } from "@/types/api/course";
import CourseCard from "./CourseCard";

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
  const totalPages = Math.max(1, courses.meta.last_page);
  if (page > totalPages) redirect(courseListHref(search, totalPages));

  return (
    <Stack gap="xl">
      <CatalogueSearch
        action="/kelas"
        search={search}
        searchLabel="Cari kelas"
        maxLength={200}
      />
      {courses.data.length ? (
        <div>
          <Group justify="space-between" gap="xs" mb="md">
            <Text size="sm" c="dimmed" role="status">
              {search
                ? `${courses.meta.total} kelas ditemukan`
                : `${courses.meta.total} kelas tersedia untuk Anda`}
            </Text>
            {search && (
              <LinkButton href="/kelas" variant="subtle">
                Hapus pencarian
              </LinkButton>
            )}
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {courses.data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </SimpleGrid>
        </div>
      ) : (
        <Center py="xl">
          <Stack gap="sm" align="center" ta="center" maw={480} role="status">
            <Title order={2} size="h3">
              {search ? "Kelas tidak ditemukan" : "Belum ada kelas untuk Anda"}
            </Title>
            <Text c="dimmed">
              {search
                ? "Coba judul lain atau tampilkan semua kelas."
                : "Kelas yang tersedia untuk jenjang Anda akan muncul di sini."}
            </Text>
            {search && (
              <LinkButton href="/kelas" variant="outline" mt="xs">
                Tampilkan semua kelas
              </LinkButton>
            )}
          </Stack>
        </Center>
      )}
      <CataloguePagination
        label="Halaman kelas"
        page={page}
        totalPages={totalPages}
        hrefForPage={(next) => courseListHref(search, next)}
      />
    </Stack>
  );
}
