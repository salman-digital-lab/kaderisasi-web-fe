"use client";

import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";

const BUILD_YEAR = Number(process.env.BUILD_YEAR);
const subscribe = (): (() => void) => () => {};

/**
 * Prerendered pages show the build year; the browser replaces it with the
 * visitor's current year without changing how pages are cached.
 */
export default function CopyrightYear(): ReactElement {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  );
  return <>{year}</>;
}
