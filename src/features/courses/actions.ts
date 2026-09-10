"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
} from "@/constants";
import { getToken } from "@/functions/auth/getToken";
import { serverApiConfig } from "@/config/apiConfig";
import fetcher, { FetcherError } from "@/functions/common/fetcher";
import type { CourseProgress } from "@/types/api/course";

const progressSchema = z.object({
  id: z.number().int().positive().max(2147483647),
  lessonId: z.number().int().positive().max(2147483647),
  completed: z.boolean().nullable(),
});
type Result =
  | { success: true; data: CourseProgress }
  | { success: false; status: number; message: string };

export async function updateCourseProgress(
  id: number,
  lessonId: number,
  completed: boolean | null,
): Promise<Result> {
  const token = await getToken();
  if (!token)
    return {
      success: false,
      status: 401,
      message: "Silakan masuk kembali untuk menyimpan progres.",
    };
  if (!progressSchema.safeParse({ id, lessonId, completed }).success)
    return { success: false, status: 404, message: "Materi tidak tersedia." };
  try {
    const response = await fetcher<{ data: CourseProgress }>(
      `${serverApiConfig.beApi}/courses/${id}/lessons/${lessonId}/${completed === null ? "visit" : "completion"}`,
      {
        method: completed === null ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completed === null ? {} : { completed }),
        cache: "no-store",
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    const status = error instanceof FetcherError ? error.status : 500;
    if (status === 401) {
      const cookieStore = await cookies();
      for (const name of [
        SESSION_COOKIE_NAME,
        NAME_COOKIE_NAME,
        PROFILE_PICTURE_COOKIE_NAME,
      ])
        cookieStore.delete(name);
    }
    return {
      success: false,
      status,
      message:
        status === 404
          ? "Materi ini sudah tidak tersedia untuk akun Anda."
          : "Progres belum tersimpan. Coba kembali.",
    };
  }
}
