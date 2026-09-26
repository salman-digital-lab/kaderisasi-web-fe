import { activity } from "./fixtures.mjs";
import { statusRegistrations } from "./status-fixtures.mjs";

// Isolated in-memory accounts for profile browser tests; no shared services or storage.
const accounts = new Map();
const provinces = [
  { id: 1, name: "Jawa Barat" },
  { id: 2, name: "DKI Jakarta" },
  { id: 99, name: "Provinsi uji gangguan" },
];
const countries = [
  { id: 1, name: "Indonesia" },
  { id: 2, name: "Malaysia" },
];
function account(token) {
  if (!accounts.has(token))
    accounts.set(token, {
      failures: new Set(),
      profileReads: 0,
      profile: {
        id: 1,
        user_id: 1,
        name: "Peserta Uji Profil",
        gender: "M",
        level: 6,
        personal_id: "",
        picture: "",
        badges: ["SSC-13", "LMD-189"],
        province_id: 1,
        city_id: 11,
        origin_province_id: 2,
        origin_city_id: 21,
        country: "Indonesia",
        birth_date: "2000-05-15",
        whatsapp: "6281234567890",
        line: "",
        instagram: "",
        linkedin: "",
        tiktok: "",
        education_history: [
          {
            degree: "bachelor",
            institution: "Institut Uji",
            faculty: "Teknik",
            major: "Informatika",
            intake_year: 2018,
          },
        ],
        work_history: [
          {
            job_title: token.includes("invalid-history") ? "" : "Relawan",
            company: "Komunitas Uji",
            start_year: 2020,
          },
        ],
        extra_data: {
          preferred_name: "Peserta",
          current_activity_focus: ["academic"],
          kaderisasi_path: { ssc: 13, lmd: 189 },
        },
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });
  return accounts.get(token);
}
function send(response, data, status = 200, message = "TEST_DATA") {
  response.statusCode = status;
  response.end(JSON.stringify({ message, data }));
  return true;
}
export async function handleProfileFixture(request, response, url) {
  const path = url.pathname;
  if (path === "/v2/certificates/code/CERT-UI/access")
    return send(response, { can_download: true, reason: "owner" });
  if (
    path === "/v2/certificates/code/CERT-UI" ||
    path === "/v2/certificates/code/CERT-UI/download"
  )
    return send(response, {
      state: "issued_active",
      activity: {
        name: activity.name,
        activity_start: "2026-07-01",
        activity_date: "1 Juli 2026",
      },
      participant: {
        name: "Peserta Uji Profil",
        activity_name: activity.name,
        activity_date: "1 Juli 2026",
      },
      template: {
        name: "Fixture browser",
        background_image: null,
        template_data: {
          backgroundUrl: null,
          canvasWidth: 800,
          canvasHeight: 600,
          elements: [
            {
              id: "fixture",
              type: "static-text",
              x: 100,
              y: 100,
              width: 600,
              height: 80,
              content: "SERTIFIKAT UJI SINTETIS",
            },
          ],
        },
      },
      certificate: {
        certificate_code: "CERT-UI",
        issued_at: "2026-07-01T00:00:00Z",
        revoked_at: null,
        revoked_reason: null,
      },
    });
  if (path === "/v2/provinces") return send(response, provinces);
  if (path === "/v2/countries") return send(response, countries);
  const city = path.match(/^\/v2\/provinces\/(\d+)\/cities$/);
  if (city)
    return send(response, [
      {
        id: Number(city[1]) * 10 + 1,
        name: city[1] === "1" ? "Kota Bandung" : "Kota Jakarta",
      },
      { id: Number(city[1]) * 10 + 2, name: "Kota uji lainnya" },
    ]);
  if (path === "/v2/universities")
    return send(response, { data: [{ id: 1, name: "Institut Uji" }] });
  const token = request.headers.authorization?.replace("Bearer ", "") ?? "";
  if (!token.startsWith("profile-")) return false;
  if (path === "/v2/achievements/1001")
    return send(response, {
      id: 1001,
      user_id: 1,
      name: "Older achievement",
      description: "Older than the first hundred records",
      achievement_date: "2025-01-01",
      type: 0,
      score: 0,
      proof: "fixture-proof.pdf",
      status: 0,
      remark: "",
    });
  const historySection = path.match(
    /^\/v2\/profiles\/history\/(activities|consultations|achievements)$/,
  )?.[1];
  if (historySection) {
    const legacyPath = {
      activities: "/v2/profiles/activities",
      consultations: "/v2/ruang-curhat",
      achievements: "/v2/achievements",
    }[historySection];
    let envelope;
    const captured = {
      statusCode: 200,
      end(body) {
        envelope = JSON.parse(body);
      },
    };
    await handleProfileFixture(request, captured, new URL(legacyPath, url));
    if (captured.statusCode !== 200)
      return send(response, null, captured.statusCode, envelope.message);
    let rows =
      historySection === "achievements" ? envelope.data.data : envelope.data;
    if (historySection === "activities")
      rows = rows
        .map(({ activity: item, ...row }) => ({
          ...row,
          activity_name: item.name,
          activity_slug: item.slug,
          image_url: item.additional_config?.images?.[0] ?? null,
          has_certificate: Boolean(
            item.additional_config?.certificate_template_id,
          ),
          visible_at: row.visible_at ?? null,
          created_at: row.created_at ?? null,
        }))
        .sort(
          (a, b) =>
            (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) ||
            b.id - a.id,
        );
    const summary = { total: rows.length };
    if (historySection === "achievements")
      summary.points = rows.reduce((sum, row) => sum + row.score, 0);
    if (historySection === "activities")
      for (const [key, statuses] of Object.entries({
        accepted: ["DITERIMA", "LULUS KEGIATAN"],
        rejected: ["TIDAK DITERIMA", "TIDAK LULUS"],
        pending: ["TERDAFTAR", "BELUM DIUMUMKAN"],
      }))
        summary[key] = rows.filter((row) =>
          statuses.includes(row.status),
        ).length;
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = url.searchParams.get("status");
    rows = rows.filter(
      (row) =>
        (!status || status === "all" || String(row.status) === status) &&
        (!search ||
          [
            row.activity_name,
            row.name,
            row.problem_category,
            row.problem_description,
            row.handling_technic,
            row.owner_name,
          ].some((value) => value?.toLowerCase().includes(search))),
    );
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const perPage = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("per_page")) || 6),
    );
    return send(response, {
      items: rows.slice((page - 1) * perPage, page * perPage),
      meta: {
        total: rows.length,
        current_page: page,
        per_page: perPage,
        last_page: Math.max(1, Math.ceil(rows.length / perPage)),
      },
      summary,
    });
  }
  const state = account(token);
  if (token.includes("expired"))
    return send(response, null, 401, "Unauthorized");
  if (path === "/v2/profiles" && request.method === "GET") {
    state.profileReads += 1;
    if (token.includes("refresh-identity") && state.profileReads === 2)
      return send(response, null, 503, "FIXTURE_UNAVAILABLE");
  }
  const section = {
    "/v2/profiles/activities": "activities",
    "/v2/ruang-curhat": "consultations",
    "/v2/achievements": "achievements",
    "/v2/profiles": "identity",
  }[path];
  if (
    request.method === "GET" &&
    token.includes(`error-${section}`) &&
    !state.failures.has(section)
  ) {
    state.failures.add(section);
    return send(response, null, 503, "FIXTURE_UNAVAILABLE");
  }
  if (path === "/v2/profiles" && request.method === "PUT") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const values = JSON.parse(Buffer.concat(chunks).toString());
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (values.name === "Gagal simpan")
      return send(response, null, 503, "Simpan gagal pada fixture.");
    state.profile = { ...state.profile, ...values };
    return send(response, state.profile, 200, "Profil berhasil diperbarui");
  }
  if (path === "/v2/profiles")
    return send(response, {
      userData: {
        id: 1,
        email: "peserta@example.test",
        member_id: "UJI-001",
        account_status: "active",
      },
      profile: state.profile,
    });
  if (path === "/v2/profiles/picture") {
    for await (const chunk of request) void chunk;
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (token.includes("upload-error") && !state.failures.has("upload")) {
      state.failures.add("upload");
      return send(response, null, 503, "UPLOAD_FAILED");
    }
    state.profile.picture = "";
    return send(response, { picture: "" });
  }
  if (path === "/v2/profiles/activities") {
    if (token.startsWith("profile-status-")) {
      if (token.includes("slow"))
        await new Promise((resolve) => setTimeout(resolve, 1500));
      return send(response, token.includes("empty") ? [] : statusRegistrations);
    }
    const statuses = [
      "TERDAFTAR",
      "DITERIMA",
      "LULUS KEGIATAN",
      "TIDAK LULUS",
      "TIDAK DITERIMA",
      "BELUM DIUMUMKAN",
      "TERDAFTAR",
      "TERDAFTAR",
    ];
    return send(
      response,
      token.includes("empty")
        ? []
        : statuses.map((status, index) => ({
            id: index + 1,
            activity_id: index + 1,
            status,
            activity: {
              ...activity,
              id: index + 1,
              slug: "kegiatan-uji-1",
              name: `${index + 1}. Pelatihan Kepemimpinan dan Kolaborasi Aktivis Salman`,
              additional_config: { images: [], certificate_template_id: 1 },
            },
            visible_at: "2026-12-01T08:00:00Z",
            certificate_code: status === "LULUS KEGIATAN" ? "CERT-UI" : null,
            certificate_state:
              status === "LULUS KEGIATAN" ? "issued_active" : undefined,
          })),
    );
  }
  if (path === "/v2/ruang-curhat")
    return send(
      response,
      token.includes("empty")
        ? []
        : [0, 1, 2, 3, 4].map((status) => ({
            id: status + 1,
            status,
            problem_ownership: 0,
            problem_category: `Sesi uji ${status + 1}`,
            handling_technic: "Online",
            problem_description:
              "Deskripsi sintetis untuk memeriksa tampilan dan keterbacaan. ".repeat(
                6,
              ),
            owner_name: "",
            created_at: "2026-08-01T09:00:00Z",
            adminUser:
              status === 3
                ? {
                    display_name: "Konselor Uji",
                    email: "konselor@example.test",
                  }
                : undefined,
          })),
    );
  if (path === "/v2/achievements")
    return send(response, {
      data: token.includes("empty")
        ? []
        : [0, 1, 2].map((status, index) => ({
            id: index + 1,
            status,
            name: [
              "Lomba karya mahasiswa",
              "Kontribusi komunitas",
              "Riset terapan",
            ][index],
            description: "Deskripsi prestasi sintetis. ".repeat(12),
            type: index,
            score: 10 * (index + 1),
            proof: "fixture-proof.pdf",
            remark: status === 2 ? "Lengkapi dokumen pendukung." : "",
            achievement_date: "2026-07-01",
          })),
    });
  return false;
}
