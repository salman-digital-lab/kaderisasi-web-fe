"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
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
      <Menu position="bottom-start" width={210}>
        <Menu.Target>
          <UnstyledButton
            className={classes.link}
            data-active={pathname.startsWith("/tentang/") || undefined}
          >
            Tentang{" "}
            <IconChevronDown size={14} style={{ marginLeft: 6 }} aria-hidden />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            href="/tentang/kalender-bmka"
            aria-current={
              pathname === "/tentang/kalender-bmka" ? "page" : undefined
            }
          >
            Kalender BMKA
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </nav>
  );
}

export default function NavigationLinks(): ReactElement {
  return <NavigationItems pathname={usePathname()} />;
}
