import type { ClubRegistration } from "@/types/model/clubRegistration";

const JAKARTA_TIME_ZONE = "Asia/Jakarta";

function getDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function normalizeDateKey(value: string): string | null {
  const dateKey = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!dateKey) return null;

  const parsedDate = new Date(`${dateKey}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== dateKey
  ) {
    return null;
  }

  return dateKey;
}

export function isClubRegistrationOpen({
  isRegistrationOpen,
  registrationEndDate,
  now = new Date(),
}: {
  isRegistrationOpen: boolean;
  registrationEndDate?: string | null;
  now?: Date;
}): boolean {
  if (!isRegistrationOpen) return false;
  if (!registrationEndDate) return true;

  const endDateKey = normalizeDateKey(registrationEndDate);
  if (!endDateKey) return false;

  return endDateKey >= getDateKey(now);
}

export type RegistrationPresentation = {
  title: string;
  description: string;
  color: "orange" | "green" | "red";
  badgeLabel: string;
};

export function getRegistrationPresentation(
  status: ClubRegistration["status"],
): RegistrationPresentation {
  const presentations: Record<
    ClubRegistration["status"],
    RegistrationPresentation
  > = {
    PENDING: {
      title: "Pendaftaran sedang ditinjau",
      description:
        "Data Anda sudah diterima dan sedang menunggu peninjauan pengelola club.",
      color: "orange",
      badgeLabel: "Menunggu",
    },
    APPROVED: {
      title: "Keanggotaan disetujui",
      description: "Pendaftaran Anda telah disetujui oleh pengelola club.",
      color: "green",
      badgeLabel: "Disetujui",
    },
    REJECTED: {
      title: "Pendaftaran belum disetujui",
      description:
        "Pendaftaran Anda telah ditinjau tetapi belum dapat disetujui.",
      color: "red",
      badgeLabel: "Ditolak",
    },
  };

  return presentations[status];
}
