"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";
import ErrorWrapper from "@/components/layout/Error";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}): ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <ErrorWrapper
      message="Terjadi kendala saat memuat halaman. Silakan coba lagi."
      reset={retry}
    />
  );
}
