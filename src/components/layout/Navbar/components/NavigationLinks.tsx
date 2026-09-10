"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import classes from "../index.module.css";

const LINKS = [
  { href: "/activity", label: "Kegiatan" },
  { href: "/clubs", label: "Klub" },
  { href: "/kelas", label: "Kelas" },
  { href: "/consultation", label: "Ruang Curhat" },
];

export function NavigationItems({
  pathname = "",
}: {
  pathname?: string;
}): ReactElement {
  return (
    <nav aria-label="Navigasi utama" className={classes.navigation}>
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={classes.link}
          aria-current={
            pathname === href || pathname.startsWith(`${href}/`)
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default function NavigationLinks(): ReactElement {
  return <NavigationItems pathname={usePathname()} />;
}
