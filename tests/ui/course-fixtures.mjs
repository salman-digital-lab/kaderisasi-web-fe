// Synthetic curriculum for catalog UI checks; no database or storage access.
const courses = Array.from({ length: 13 }, (_, index) => ({
  id: index + 1,
  title: `Kelas uji ${index + 1}`,
  summary:
    "Materi video dan bahan bacaan untuk pengujian tampilan katalog kelas.",
  minimum_level: [0, 3, 6, 10][index % 4],
  total_lessons: 4,
  completed_lessons: [0, 2, 4, 0][index % 4],
  resume_lesson_id: index % 4 === 0 ? null : 2,
}));
const failures = new Set();

export function handleCourseFixture(request, response, url) {
  if (!url.pathname.startsWith("/v2/courses")) return false;
  const token = request.headers.authorization?.replace("Bearer ", "");
  function send(data, status = 200) {
    response.statusCode = status;
    response.setHeader("Cache-Control", "private, no-store");
    response.end(JSON.stringify({ message: "COURSE_UI_FIXTURE", data }));
    return true;
  }
  if (!token) return send(null, 401);
  if (token.includes("course-error") && !failures.has(token)) {
    failures.add(token);
    return send(null, 503);
  }
  if (url.pathname === "/v2/courses") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const items =
      token === "ui-empty"
        ? []
        : courses.filter((course) =>
            course.title.toLowerCase().includes(search),
          );
    const page = Number(url.searchParams.get("page")) || 1;
    const perPage = Number(url.searchParams.get("per_page")) || 12;
    return send({
      data: items.slice((page - 1) * perPage, page * perPage),
      meta: {
        total: items.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.max(1, Math.ceil(items.length / perPage)),
      },
    });
  }
  const course = courses.find(
    (course) => url.pathname === `/v2/courses/${course.id}`,
  );
  if (!course) return send(null, 404);
  return send({
    ...course,
    description: "<p>Konten sintetis untuk pemeriksaan navigasi kelas.</p>",
    lessons: Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      title: `Materi uji ${index + 1}`,
      position: index + 1,
      completed: index < course.completed_lessons,
    })),
  });
}
