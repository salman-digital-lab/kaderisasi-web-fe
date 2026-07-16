"use server";

import { revalidateTag } from "next/cache";
import { registerWithCustomForm } from "../../services/customForm";
import { FetcherError } from "../common/fetcher";
import { CACHE_TAGS } from "../../constants/cache";
import type { PostCustomFormRegistrationReq } from "../../types/api/customForm";
import { getErrorMessage } from "../../types/server-action";
import type { ServerActionResult } from "../../types/server-action";
import { verifySession } from "./session";

function getRegistrationErrorMessage(error: unknown): string {
  if (!(error instanceof FetcherError)) {
    return getErrorMessage(error, "Terjadi kesalahan saat mendaftar");
  }

  if (error.status === 401) {
    return "Sesi Anda telah berakhir. Silakan masuk kembali sebelum mengirim formulir.";
  }

  const messages: Record<string, string> = {
    INVALID_FORM_SUBMISSION:
      "Jawaban belum sesuai dengan formulir terbaru. Muat ulang halaman, periksa kembali semua isian, lalu kirim ulang.",
    REGISTRATION_CLOSED:
      "Pendaftaran telah ditutup. Kembali ke halaman detail untuk melihat informasi terbaru.",
    ACTIVE_CUSTOM_FORM_REQUIRED:
      "Form pendaftaran sudah tidak tersedia. Muat ulang halaman untuk melihat informasi terbaru.",
    ALREADY_REGISTERED: "Anda sudah terdaftar pada program ini.",
  };

  const messageKey = error.code || error.message;
  return (
    messages[messageKey] ??
    getErrorMessage(error, "Terjadi kesalahan saat mendaftar")
  );
}

export default async function registerCustomForm(
  data: PostCustomFormRegistrationReq,
): Promise<ServerActionResult> {
  const { session } = await verifySession();

  try {
    const response = await registerWithCustomForm(session || "", data);
    revalidateTag(CACHE_TAGS.ACTIVITIES, {});
    return {
      success: true,
      message: response.message || "Pendaftaran berhasil",
      data: response.data,
    };
  } catch (error: unknown) {
    // Return error as data instead of throwing
    // This ensures the error message reaches the frontend in production
    return {
      success: false,
      message: getRegistrationErrorMessage(error),
    };
  }
}
