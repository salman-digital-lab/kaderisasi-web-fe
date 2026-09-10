"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { ReactElement } from "react";
import {
  Alert,
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import DetailBackLink from "@/components/layout/DetailBackLink";
import LinkButton from "@/components/common/LinkButton";
import RichTextContent from "@/components/common/RichTextContent";
import { updateCourseProgress } from "@/features/courses/actions";
import {
  completionPercentage,
  courseHref,
  lessonHref,
} from "@/features/courses/paths";
import type { LessonDetail } from "@/types/api/course";
import LessonList from "./LessonList";
import classes from "./Courses.module.css";

export default function LessonContent({
  data,
}: {
  data: LessonDetail;
}): ReactElement {
  const [completed, setCompleted] = useState(data.lesson.completed);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const visited = useRef(false);
  const retryValue = useRef<boolean | null>(null);
  const router = useRouter();
  const { course, lesson } = data;
  const index = data.lessons.findIndex((item) => item.id === lesson.id);
  const previous = data.lessons[index - 1];
  const next = data.lessons[index + 1];
  const lessons = data.lessons.map((item) =>
    item.id === lesson.id ? { ...item, completed } : item,
  );
  const completeCount = lessons.filter((item) => item.completed).length;

  useEffect(() => {
    const visit = (): void => {
      if (visited.current || document.visibilityState !== "visible") return;
      visited.current = true;
      void updateCourseProgress(course.id, lesson.id, null)
        .then((result) => {
          if (!result.success) setError(result.message);
        })
        .catch(() => setError("Kunjungan belum tersimpan. Coba kembali."));
    };
    visit();
    document.addEventListener("visibilitychange", visit);
    return () => document.removeEventListener("visibilitychange", visit);
  }, [course.id, lesson.id]);

  const saveProgress = (value: boolean | null): void => {
    retryValue.current = value;
    setError("");
    startTransition(async () => {
      try {
        const result = await updateCourseProgress(course.id, lesson.id, value);
        if (result.success) {
          setCompleted(result.data.completed);
          router.refresh();
        } else {
          if (result.status === 401)
            router.push(
              `/login?redirect=${encodeURIComponent(lessonHref(course.id, lesson.id))}`,
            );
          setError(result.message);
        }
      } catch {
        setError("Progres belum tersimpan. Coba kembali.");
      }
    });
  };

  return (
    <PageContainer>
      <DetailBackLink href={courseHref(course.id)}>
        {course.title}
      </DetailBackLink>
      <PageHeader
        title={lesson.title}
        description={`Materi ${index + 1} dari ${data.lessons.length}`}
      />
      <div className={classes.learningLayout}>
        <div className={classes.main}>
          <Stack gap="xl">
            <iframe
              className={classes.video}
              src={`https://www.youtube.com/embed/${lesson.youtube_video_id}?playsinline=1&rel=0`}
              title={`Video: ${lesson.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {lesson.description && (
              <section aria-label="Deskripsi materi">
                <RichTextContent html={lesson.description} />
              </section>
            )}
            {data.documents.length > 0 && (
              <section>
                <Title order={2} size="h3" mb="md">
                  Dokumen materi
                </Title>
                <Stack gap="sm">
                  {data.documents.map((document) => (
                    <Button
                      key={document.id}
                      component="a"
                      href={`/api/courses/${course.id}/lessons/${lesson.id}/documents/${document.id}/download`}
                      variant="default"
                      h="auto"
                      mih={44}
                      py="sm"
                      styles={{
                        label: {
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          textAlign: "left",
                        },
                      }}
                    >
                      Unduh {document.filename} (
                      {(document.size_bytes / 1024 / 1024).toFixed(1)} MB)
                    </Button>
                  ))}
                </Stack>
              </section>
            )}
            {error && (
              <Alert color="red" title="Progres belum tersimpan">
                <Stack gap="sm">
                  <Text>{error}</Text>
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => saveProgress(retryValue.current)}
                    loading={pending}
                  >
                    Coba kembali
                  </Button>
                </Stack>
              </Alert>
            )}
            <Group justify="space-between">
              <Text aria-live="polite">
                {completed
                  ? "Materi sudah ditandai selesai."
                  : "Tandai selesai setelah mempelajari materi ini."}
              </Text>
              <Button
                onClick={() => saveProgress(!completed)}
                loading={pending}
                variant={completed ? "default" : "filled"}
                mih={44}
              >
                {completed ? "Batalkan selesai" : "Tandai selesai"}
              </Button>
            </Group>
            <Group justify="space-between">
              {previous && (
                <LinkButton
                  href={lessonHref(course.id, previous.id)}
                  variant="default"
                  mih={44}
                >
                  Materi sebelumnya
                </LinkButton>
              )}
              {next && (
                <LinkButton
                  href={lessonHref(course.id, next.id)}
                  variant="light"
                  mih={44}
                >
                  Materi berikutnya
                </LinkButton>
              )}
            </Group>
          </Stack>
        </div>
        <Paper
          component="aside"
          withBorder
          radius="md"
          p="md"
          className={classes.sidebar}
        >
          <Stack gap="md">
            <Title order={2} size="h3">
              Materi kelas
            </Title>
            <Text size="sm">
              {completeCount} dari {lessons.length} selesai
            </Text>
            <Progress
              value={completionPercentage(completeCount, lessons.length)}
              aria-label="Progres kelas"
            />
            <LessonList
              courseId={course.id}
              lessons={lessons}
              activeId={lesson.id}
            />
          </Stack>
        </Paper>
      </div>
    </PageContainer>
  );
}
