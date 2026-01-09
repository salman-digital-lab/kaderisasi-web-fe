"use server";

import { registerWithCustomForm } from "../../services/customForm";
import { PostCustomFormRegistrationReq } from "../../types/api/customForm";
import { ServerActionResult, getErrorMessage } from "../../types/server-action";
import { verifySession } from "./session";

export default async function registerCustomForm(
  data: PostCustomFormRegistrationReq,
): Promise<ServerActionResult> {
  const { session } = await verifySession();

  try {
    const response = await registerWithCustomForm(session || "", data);
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
      message: getErrorMessage(error, "Terjadi kesalahan saat mendaftar"),
    };
  }
}
