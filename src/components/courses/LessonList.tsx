import Link from "next/link";
import { IconCircleCheck, IconPlayerPlay } from "@tabler/icons-react";
import type { ReactElement } from "react";
import type { LessonSummary } from "@/types/api/course";
import { lessonHref } from "@/features/courses/paths";
import classes from "./Courses.module.css";

export default function LessonList({
  courseId,
  lessons,
  activeId,
}: {
  courseId: number;
  lessons: LessonSummary[];
  activeId?: number;
}): ReactElement {
  return (
    <ol className={classes.lessonList}>
      {lessons.map((lesson, index) => (
        <li key={lesson.id}>
          <Link
            href={lessonHref(courseId, lesson.id)}
            prefetch={false}
            className={classes.lessonLink}
            aria-current={activeId === lesson.id ? "page" : undefined}
          >
            {lesson.completed ? (
              <IconCircleCheck
                size={20}
                className={classes.lessonIcon}
                aria-label="Selesai"
              />
            ) : (
              <IconPlayerPlay
                size={20}
                className={classes.lessonIcon}
                aria-hidden
              />
            )}
            <span>
              {index + 1}. {lesson.title}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
