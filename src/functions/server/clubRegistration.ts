"use server";

import { FetcherError } from "@/functions/common/fetcher";
import { verifySession } from "@/functions/server/session";
import {
  cancelMyRegistration,
  getRegistrationStatus,
} from "@/services/clubRegistration";
import type { ClubRegistrationStatus } from "@/types/model/clubRegistration";

type FailureReason = "UNAUTHENTICATED" | "UNAVAILABLE";

export type ClubRegistrationActionResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; reason: FailureReason };

function isValidClubId(clubId: number): boolean {
  return Number.isSafeInteger(clubId) && clubId > 0;
}

export async function checkClubRegistrationStatus(
  clubId: number,
): Promise<ClubRegistrationActionResult<ClubRegistrationStatus>> {
  const { session } = await verifySession();

  if (!session) {
    return {
      success: false,
      reason: "UNAUTHENTICATED",
      message: "Sesi Anda telah berakhir. Silakan masuk kembali.",
    };
  }

  if (!isValidClubId(clubId)) {
    return {
      success: false,
      reason: "UNAVAILABLE",
      message: "Club tidak valid.",
    };
  }

  try {
    const response = await getRegistrationStatus(clubId, session);
    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof FetcherError && error.status === 401) {
      return {
        success: false,
        reason: "UNAUTHENTICATED",
        message: "Sesi Anda telah berakhir. Silakan masuk kembali.",
      };
    }

    return {
      success: false,
      reason: "UNAVAILABLE",
      message: "Status pendaftaran belum dapat diperiksa. Silakan coba lagi.",
    };
  }
}

export async function cancelClubRegistration(
  clubId: number,
): Promise<ClubRegistrationActionResult<null>> {
  const { session } = await verifySession();

  if (!session) {
    return {
      success: false,
      reason: "UNAUTHENTICATED",
      message: "Sesi Anda telah berakhir. Silakan masuk kembali.",
    };
  }

  if (!isValidClubId(clubId)) {
    return {
      success: false,
      reason: "UNAVAILABLE",
      message: "Club tidak valid.",
    };
  }

  try {
    const response = await cancelMyRegistration(clubId, session);
    return {
      success: true,
      message: "Pendaftaran berhasil dibatalkan.",
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof FetcherError && error.status === 401) {
      return {
        success: false,
        reason: "UNAUTHENTICATED",
        message: "Sesi Anda telah berakhir. Silakan masuk kembali.",
      };
    }

    return {
      success: false,
      reason: "UNAVAILABLE",
      message:
        error instanceof FetcherError &&
        error.message === "REGISTRATION_NOT_FOUND"
          ? "Pendaftaran tidak ditemukan atau sudah dibatalkan."
          : error instanceof FetcherError &&
              error.message === "CANNOT_CANCEL_REGISTRATION"
            ? "Pendaftaran yang sudah diproses tidak dapat dibatalkan."
            : "Pendaftaran belum dapat dibatalkan. Silakan coba lagi.",
    };
  }
}
