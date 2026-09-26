import { activity } from "./fixtures.mjs";

// Only served by the isolated browser-test API for profile-status-* sessions.
export const statusRegistrations = [
  "DITERIMA",
  "TERDAFTAR",
  "LULUS KEGIATAN",
  "TIDAK LULUS",
  "TIDAK DITERIMA",
  "BELUM DIUMUMKAN",
  "LULUS KEGIATAN",
  "LULUS KEGIATAN",
  "LULUS KEGIATAN",
  "LULUS KEGIATAN",
  "BELUM DIUMUMKAN",
  "BELUM DIUMUMKAN",
  "BELUM TERDAFTAR",
  "DALAM PENINJAUAN",
]
  .map((status, index) => ({
    id: index + 1,
    activity_id: index + 1,
    status,
    created_at:
      index === 12
        ? ""
        : index === 13
          ? "invalid"
          : `2026-09-${String(26 - index).padStart(2, "0")}T05:00:00Z`,
    activity: {
      ...activity,
      id: index + 1,
      name: `${index + 1}. Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman`,
      additional_config: { images: [], certificate_template_id: 1 },
    },
    ...(index === 5 ? { visible_at: "2099-12-01T08:00:00Z" } : {}),
    ...(index === 10 ? { visible_at: "invalid" } : {}),
    ...(index === 2
      ? { certificate_code: "CERT-UI", certificate_state: "issued_active" }
      : {}),
    ...(index === 6
      ? {
          certificate_code: "CERT-REVOKED",
          certificate_state: "issued_revoked",
        }
      : {}),
    ...(index === 7 ? { certificate_state: "eligible_not_issued" } : {}),
    ...(index === 8 ? { certificate_state: "not_eligible" } : {}),
  }))
  .reverse();
