import Image from "next/image";
import Link from "next/link";
import { Container, Paper, Text, Title } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import logo from "@/assets/bmka_logo_color.png";
import LinkButton from "@/components/common/LinkButton";
import classes from "./AuthLayout.module.css";

type AuthLayoutProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  alternate?: ReactNode;
};

export default function AuthLayout({
  title,
  description,
  children,
  alternate,
}: AuthLayoutProps): ReactElement {
  return (
    <main id="main-content" tabIndex={-1} className={classes.main}>
      <Container size={480} className={classes.container}>
        <Link
          href="/"
          className={classes.logo}
          aria-label="Kaderisasi Salman — Beranda"
        >
          <Image src={logo} alt="BMKA Salman ITB" width={180} priority />
        </Link>
        <Paper withBorder p={{ base: "lg", sm: "xl" }} radius="md">
          <header className={classes.header}>
            <Title order={1} size="h2">
              {title}
            </Title>
            <Text c="dimmed" mt="xs">
              {description}
            </Text>
          </header>
          {children}
          {alternate && (
            <Text ta="center" size="sm" mt="lg">
              {alternate}
            </Text>
          )}
        </Paper>
        <Text c="dimmed" size="sm" ta="center" mt="lg">
          Butuh bantuan?{" "}
          <a href="https://wa.me/6285156168499" className={classes.link}>
            Hubungi admin melalui WhatsApp
          </a>
          .
        </Text>
        <LinkButton href="/" variant="subtle" fullWidth mt="sm">
          Kembali ke Beranda
        </LinkButton>
        <nav aria-label="Informasi hukum" className={classes.legal}>
          <Link href="/privacy-policy" className={classes.link}>
            Kebijakan Privasi
          </Link>
          <Link href="/terms-of-service" className={classes.link}>
            Syarat dan Ketentuan
          </Link>
        </nav>
      </Container>
    </main>
  );
}
