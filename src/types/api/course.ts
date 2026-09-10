export type CourseSummary = {
  id: number;
  title: string;
  summary: string;
  minimum_level: number;
  total_lessons: number;
  completed_lessons: number;
  resume_lesson_id: number | null;
};
export type LessonSummary = {
  id: number;
  title: string;
  position: number;
  completed: boolean;
};
export type CourseDetail = CourseSummary & {
  description: string;
  lessons: LessonSummary[];
};
export type LessonDetail = {
  course: CourseSummary;
  lesson: LessonSummary & { description: string; youtube_video_id: string };
  lessons: LessonSummary[];
  documents: { id: number; filename: string; size_bytes: number }[];
};
export type CoursePage = {
  data: CourseSummary[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
export type CourseProgress = {
  completed: boolean;
  completed_at: string | null;
  last_visited_at: string;
};
