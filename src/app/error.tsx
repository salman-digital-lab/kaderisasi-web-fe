"use client";

import BrowserChrome from "@/components/layout/BrowserChrome";
import classes from "@/components/layout/SiteLayout.module.css";

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
    <main id="main-content" tabIndex={-1} className={classes.standalone}>
      <BrowserChrome />
      <ErrorWrapper
        message="Terjadi kendala saat memuat halaman. Silakan coba lagi."
        reset={retry}
      />
    </main>
  );
}
