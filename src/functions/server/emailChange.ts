"use server";

import { setLoginSession } from "@/functions/auth/setLoginSession";
import { FetcherError } from "@/functions/common/fetcher";
import {
  deleteEmailChange,
  getEmailChange,
  postEmailChange,
  postEmailChangeCode,
  putConfirmEmailChange,
} from "@/services/emailChange";
import type {
  EmailChangeStatus,
  EmailChangeStep,
} from "@/types/api/email-change";
import type { ServerActionResult } from "@/types/server-action";
import { EMAIL_CHANGE_MESSAGES as MESSAGES } from "@/features/profile/EmailChange/messages";
import { verifySession } from "./session";

function failure(error: unknown, fallback: string): ServerActionResult<never> {
  const code = error instanceof Error ? error.message : "";
  if (MESSAGES[code]) return { success: false, message: MESSAGES[code] };
  // A 401 without a known code (WRONG_PASSWORD is one) is a lost session.
  if (error instanceof FetcherError && error.status === 401) {
    return {
      success: false,
      message: "Sesi Anda berakhir. Silakan masuk lagi.",
    };
  }
  return { success: false, message: fallback };
}

async function session(): Promise<string> {
  return (await verifySession()).session || "";
}

export async function getEmailChangeStatus(): Promise<
  ServerActionResult<EmailChangeStatus>
> {
  try {
    const response = await getEmailChange(await session());
    return { success: true, message: response.message, data: response.data };
  } catch (error) {
    return failure(error, "Status perubahan email gagal dimuat.");
  }
}

export async function startEmailChange(input: {
  email: string;
  password?: string;
}): Promise<ServerActionResult<EmailChangeStep>> {
  const email = input.email.trim().toLowerCase();
  try {
    const response = await postEmailChange(await session(), {
      email,
      ...(input.password ? { password: input.password } : {}),
    });
    return { success: true, message: response.message, data: response.data };
  } catch (error) {
    return failure(error, "Permintaan perubahan email gagal.");
  }
}

export async function verifyEmailChangeCode(
  code: string,
): Promise<ServerActionResult<EmailChangeStep>> {
  try {
    const response = await postEmailChangeCode(await session(), code.trim());
    return { success: true, message: response.message, data: response.data };
  } catch (error) {
    return failure(error, "Kode gagal diperiksa.");
  }
}

export async function cancelEmailChange(): Promise<ServerActionResult> {
  try {
    const response = await deleteEmailChange(await session());
    return { success: true, message: response.message };
  } catch (error) {
    return failure(error, "Permintaan gagal dibatalkan.");
  }
}

/** Applies the change from the emailed link and signs in with the fresh session. */
export async function confirmEmailChange(
  token: string,
): Promise<ServerActionResult<{ email: string }>> {
  try {
    const response = await putConfirmEmailChange(token);
    await setLoginSession(response);
    return {
      success: true,
      message: response.message,
      data: { email: response.data.user.email || "" },
    };
  } catch (error) {
    return failure(error, "Email gagal dikonfirmasi.");
  }
}
