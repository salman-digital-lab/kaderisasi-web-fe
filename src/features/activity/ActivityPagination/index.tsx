"use client";

import { Pagination } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

export default function ActivityPagination({
  total,
}: {
  total: number;
  current?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPaginationChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(value));

    router.push("/activity?" + params);
  };

  return <Pagination total={total} mt="xl" onChange={onPaginationChange} />;
}
