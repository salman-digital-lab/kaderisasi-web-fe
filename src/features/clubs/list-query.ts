import { CLUB_TYPES, type ClubType } from "../../types/model/club";

export const CLUBS_PAGE_SIZE = 12;
export const MAX_CLUB_SEARCH_LENGTH = 100;

export type ClubListQuery = {
  search: string;
  clubType?: ClubType;
  page: number;
};

type SearchParamValue = string | string[] | undefined;

function normalizeParam(value: SearchParamValue): string {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.trim() ?? "";
}

function normalizePage(value: SearchParamValue): number {
  const normalized = normalizeParam(value);

  if (!/^\d+$/.test(normalized)) {
    return 1;
  }

  const page = Number(normalized);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseClubListQuery(params: {
  search?: SearchParamValue;
  type?: SearchParamValue;
  page?: SearchParamValue;
}): ClubListQuery {
  const type = normalizeParam(params.type);

  return {
    search: normalizeParam(params.search).slice(0, MAX_CLUB_SEARCH_LENGTH),
    clubType: CLUB_TYPES.find((clubType) => clubType === type),
    page: normalizePage(params.page),
  };
}

export function buildClubsHref({
  search,
  clubType,
  page = 1,
}: Omit<ClubListQuery, "page"> & { page?: number }): string {
  const params = new URLSearchParams();
  const normalizedSearch = search.trim();

  if (normalizedSearch) params.set("search", normalizedSearch);
  if (clubType) params.set("type", clubType);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/clubs?${query}` : "/clubs";
}

export { getPaginationItems } from "@/functions/common/pagination";
export type { PaginationItem } from "@/functions/common/pagination";
