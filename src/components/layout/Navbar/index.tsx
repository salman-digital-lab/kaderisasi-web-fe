import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { Group, Container, Loader } from "@mantine/core";
import logo from "@/assets/bmka_logo_color.png";
import SessionControls from "./components/SessionControls";
import classes from "./index.module.css";
import NavigationLinks, { NavigationItems } from "./components/NavigationLinks";

export default function Navbar(): ReactElement {
  return (
    <header className={classes.header}>
      <Container size="lg" h="100%">
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Link
            href="/"
            className={classes.brand}
            aria-label="Kaderisasi Salman — Beranda"
          >
            <Image src={logo} alt="BMKA Salman ITB" width={100} />
          </Link>
          <Suspense fallback={<NavigationItems />}>
            <NavigationLinks />
          </Suspense>
          <Suspense
            fallback={<Loader size="sm" aria-label="Memuat menu akun" />}
          >
            <SessionControls />
          </Suspense>
        </Group>
      </Container>
    </header>
  );
}
