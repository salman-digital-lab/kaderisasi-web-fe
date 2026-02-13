"use server";

import { revalidateTag } from "next/cache";
import { putActivity } from "../../services/activity";
import { CACHE_TAGS } from "../../constants/cache";
import { ServerActionResult, getErrorMessage } from "../../types/server-action";
import { verifySession } from "./session";

export default async function updateActivityCustomForm(
  slug: string,
  customFormData: Record<string, any>,
): Promise<ServerActionResult> {
  const { session } = await verifySession();

  try {
    const response = await putActivity(session || "", {
      slug,
      data: { questionnaire_answer: customFormData },
    });
    revalidateTag(CACHE_TAGS.ACTIVITIES, {});
    return {
      success: true,
      message: response.message || "Formulir berhasil diperbarui",
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Terjadi kesalahan saat memperbarui formulir",
      ),
    };
  }
}
