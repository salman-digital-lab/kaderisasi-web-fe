export const activities = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  name: `Kegiatan uji ${index + 1}`,
  slug: `kegiatan-uji-${index + 1}`,
  minimum_level: 0,
  registration_end: "2026-12-31",
  additional_config: { images: [] },
}));

export const clubs = Array.from({ length: 13 }, (_, index) => ({
  id: index + 1,
  name: `Klub uji ${index + 1}`,
  club_type: "UNIT",
  short_description: "Data klub untuk pengujian navigasi.",
  logo: "",
  start_period: null,
  end_period: null,
  is_registration_open: false,
}));

export function paginate(items, params) {
  const search = params.get("search")?.toLowerCase() || "";
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search),
  );
  const page = Math.max(1, Number(params.get("page")) || 1);
  const perPage = Math.max(1, Number(params.get("per_page")) || 8);
  return {
    meta: {
      total: filtered.length,
      per_page: perPage,
      current_page: page,
      last_page: Math.max(1, Math.ceil(filtered.length / perPage)),
      first_page: 1,
    },
    data: filtered.slice((page - 1) * perPage, page * perPage),
  };
}
