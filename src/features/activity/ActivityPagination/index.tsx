"use client";

import { Pagination } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactElement } from "react";

export default function ActivityPagination({
  total,
  current,
}: {
  total: number;
  current: number;
}): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPaginationChange = (value: number): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(value));

    router.push("/activity?" + params);
  };

  return (
    <Pagination
      total={total}
      value={current}
      mt="xl"
      onChange={onPaginationChange}
    />
  );
}
