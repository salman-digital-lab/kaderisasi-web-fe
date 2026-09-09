import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { Group, Box, Loader } from "@mantine/core";
import logo from "@/assets/bmka_logo_color.png";
import SessionControls from "./components/SessionControls";
import classes from "./index.module.css";

export default function Navbar(): ReactElement {
  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image src={logo} alt="bmka" width={100} />
          </Link>
          <Group h="100%" gap={0} visibleFrom="md">
            <Link href="/activity" className={classes.link}>
              Kegiatan
            </Link>
            <Link href="/clubs" className={classes.link}>
              Klub
            </Link>
            <Link href="/consultation" className={classes.link}>
              Ruang Curhat
            </Link>
          </Group>
          <Suspense
            fallback={<Loader size="sm" aria-label="Memuat menu akun" />}
          >
            <SessionControls />
          </Suspense>
        </Group>
      </header>
    </Box>
  );
}
