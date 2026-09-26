"use client";

import { useEffect, useState } from "react";
import type {
  HistorySection,
  ProfileHistories,
} from "@/types/api/profile-history";

export type HistoryState<K extends HistorySection> = {
  data?: ProfileHistories[K];
  pending: boolean;
  error: string;
  page: number;
  search: string;
  status: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  clear: () => void;
  retry: () => void;
};

export function useProfileHistory<K extends HistorySection>(
  section: K,
  active: boolean,
  perPage = 6,
  searchScope?: "name",
): HistoryState<K> {
  const [data, setData] = useState<ProfileHistories[K]>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("all");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (!active || search.trim() !== debounced) return;
    const controller = new AbortController();
    setPending(true);
    setError("");
    const query = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      search: debounced,
      status,
    });
    if (searchScope) query.set("search_scope", searchScope);
    void fetch(`/api/profile-history/${section}?${query}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (controller.signal.aborted)
          throw new DOMException("Aborted", "AbortError");
        if (response.status === 401) {
          // The logout route must clear HttpOnly cookies through a document request.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign(
            `/api/logout?redirect=${encodeURIComponent(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}`,
          );
          throw new Error("Sesi berakhir. Silakan masuk kembali.");
        }
        if (!response.ok)
          throw new Error("Riwayat belum dapat dimuat. Silakan coba lagi.");
        return response.json() as Promise<{ data: ProfileHistories[K] }>;
      })
      .then((result) => {
        if (controller.signal.aborted) return;
        if (page > result.data.meta.last_page) {
          setPage(result.data.meta.last_page);
          return;
        }
        setData(result.data);
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted)
          setError(
            failure instanceof Error
              ? failure.message
              : "Riwayat belum dapat dimuat.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setPending(false);
      });
    return () => controller.abort();
  }, [
    active,
    section,
    page,
    perPage,
    search,
    debounced,
    status,
    revision,
    searchScope,
  ]);
  return {
    data,
    pending:
      pending || (active && !data && !error) || search.trim() !== debounced,
    error,
    page,
    search,
    status,
    setPage,
    setSearch: (value) => {
      setSearch(value.slice(0, 200));
      setPage(1);
    },
    setStatus: (value) => {
      setStatus(value);
      setPage(1);
    },
    clear: () => {
      setSearch("");
      setDebounced("");
      setStatus("all");
      setPage(1);
    },
    retry: () => setRevision((value) => value + 1),
  };
}
