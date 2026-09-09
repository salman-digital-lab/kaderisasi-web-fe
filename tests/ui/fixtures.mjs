// Synthetic data for layout checks. Used only by scripts/instant-server.mjs.
const date = "2026-07-01T09:00:00Z";
export const activity = {
  id: 1,
  name: "Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman",
  slug: "kegiatan-uji-1",
  minimum_level: 0,
  activity_category: 0,
  activity_type: 1,
  description:
    "<p>Kembangkan kemampuan memimpin, bekerja sama, dan berkontribusi dalam kegiatan komunitas.</p><h3>Informasi kegiatan</h3><p>Kegiatan terbuka untuk peserta yang ingin belajar dan bertumbuh bersama.</p>",
  activity_start: "2026-12-20",
  activity_end: "2026-12-21",
  registration_end: "2099-12-31",
  is_registration_open: true,
  additional_config: { images: [], allow_guest_registration: true },
};
const profile = {
  userData: {
    id: 1,
    email: "peserta@example.test",
    member_id: "UI-001",
    account_status: "active",
  },
  profile: {
    id: 1,
    name: "Peserta Uji Tampilan",
    user_id: 1,
    level: 0,
    badges: [],
    picture: "",
    gender: "Laki-laki",
    whatsapp: "081234567890",
    birth_date: "2000-01-01",
    country: "Indonesia",
    education_history: [],
    work_history: [],
    extra_data: {},
    created_at: date,
    updated_at: date,
  },
};
const registration = {
  id: 1,
  activity_id: 1,
  registration_id: 1,
  activity,
  status: "DITERIMA",
  questionnaire_answer: {},
  created_at: date,
  updated_at: date,
};
const achievement = {
  id: 1,
  name: "Kompetisi Inovasi Mahasiswa",
  description: "Pengembangan solusi untuk komunitas.",
  achievement_date: "2026-07-01",
  type: "competition",
  status: "PENDING",
  proof: "",
  score: 10,
};

export function uiFixture(url, authorization) {
  const path = url.pathname;
  const signedIn =
    authorization === "Bearer ui-preview" ||
    authorization === "Bearer ui-empty";
  if (path === "/v2/profiles" && signedIn) return profile;
  if (path === "/v2/activities/kegiatan-uji-1") return activity;
  if (path === "/v2/profiles/activities")
    return authorization === "Bearer ui-empty" ? [] : [registration];
  if (path === "/v2/profiles/activities/kegiatan-uji-1") return registration;
  if (path === "/v2/activities/kegiatan-uji-1/registration")
    return registration;
  if (path === "/v2/achievements") return { data: [achievement] };
  if (path === "/v2/achievements/my-rank") return { rank: 1, score: 100 };
  if (path === "/v2/achievements/lifetime")
    return {
      data: [{ id: 1, score: 100, user: { profile: profile.profile } }],
    };
  if (path === "/v2/clubs/1")
    return {
      id: 1,
      name: "Klub Kolaborasi Salman",
      club_type: "UNIT",
      logo: "",
      short_description: "Ruang belajar dan berkarya bersama aktivis Salman.",
      description:
        "<p>Bangun pengalaman dan jejaring melalui kegiatan bersama.</p>",
      start_period: "2026-01-01",
      end_period: "2026-12-31",
      is_registration_open: true,
      registration_end_date: "2099-12-31",
      media: { items: [] },
      activities: [activity],
      leadership: [],
    };
  if (path === "/v2/clubs/1/registration-status")
    return { isRegistered: false, registration: null };
  if (path === "/v2/clubs/2")
    return {
      id: 2,
      name: "Klub Uji Terdaftar",
      club_type: "UNIT",
      logo: "",
      is_registration_open: true,
      media: { items: [] },
      activities: [],
      leadership: [],
    };
  if (path === "/v2/clubs/2/registration-status")
    return { isRegistered: true, registration: { id: 2, status: "PENDING" } };
  if (path === "/v2/custom-forms/by-feature")
    return {
      id: 1,
      form_name: "Formulir Pendaftaran Kegiatan",
      form_description: "Lengkapi data berikut untuk melanjutkan pendaftaran.",
      post_submission_info:
        "<p>Pantau status pendaftaran melalui halaman Kegiatan Saya.</p>",
      feature_type: url.searchParams.get("feature_type"),
      feature_id: Number(url.searchParams.get("feature_id")),
      is_active: true,
      form_schema: {
        fields: [
          {
            section_name: "Informasi Peserta",
            fields: [
              {
                key: "motivation",
                label: "Motivasi mengikuti kegiatan",
                type: "textarea",
                required: true,
              },
            ],
          },
        ],
      },
      created_at: date,
      updated_at: date,
    };
  if (path.startsWith("/v2/certificates/registrations/"))
    return {
      registration_id: 1,
      certificate_code: null,
      issued_at: null,
      revoked_at: null,
      state: "eligible_not_issued",
    };
  if (path === "/v2/certificates/verify/CERT-UI")
    return {
      certificate_code: "CERT-UI",
      state: "issued_active",
      valid: true,
      participant_name: "Peserta Uji Tampilan",
      activity_name: activity.name,
      activity_date: "20 Desember 2026",
      issued_at: date,
      revoked_at: null,
      revoked_reason: null,
    };
  return undefined;
}
