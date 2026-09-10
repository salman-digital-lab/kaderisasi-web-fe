"use server";

import { putProfile } from "../../services/profile";
import { PutProfileReq } from "../../types/api/user";
import { ServerActionResult, getErrorMessage } from "../../types/server-action";

import { verifySession } from "./session";
import { profileHistorySchema } from "@/features/profile/history-schema";
import type { Member } from "@/types/model/members";

type LoginFormData = PutProfileReq;

export default async function editProfile(
  data: LoginFormData,
): Promise<ServerActionResult<Member>> {
  const history = profileHistorySchema.safeParse(data);
  if (!history.success) {
    return { success: false, message: history.error.issues[0]?.message || "Riwayat tidak valid" };
  }
  const formData = {
    ...data,
    ...history.data,
    province_id: data.province_id ? Number(data.province_id) : undefined,
  };

  const { session } = await verifySession();

  try {
    const response = await putProfile(session || "", formData);
    return {
      success: true,
      message: response.message || "Profil berhasil diperbarui",
      data: response.data,
    };
  } catch (error: unknown) {
    // Return error as data instead of throwing
    // This ensures the error message reaches the frontend in production
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Terjadi kesalahan saat memperbarui profil",
      ),
    };
  }
}
