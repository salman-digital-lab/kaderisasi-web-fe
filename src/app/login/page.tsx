import Image from "next/image";
import { Anchor, Paper, Title, Text, Container, Button } from "@mantine/core";
import Link from "next/link";

import logo from "@/assets/bmka_logo_color.png";
import LoginForm from "../../features/auth/LoginForm";

import classes from "./index.module.css";

export const metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Kaderisasi Salman untuk mendaftar kegiatan, mengakses Ruang Curhat, dan melihat status pendaftaran Anda.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const redirect = (await searchParams).redirect;
  return (
    <Container size={420} my={40}>
      <div className={classes.logo}>
        <Image src={logo} alt="bmka" fill />
      </div>

      <Title ta="center" className={classes.title}>
        Selamat Datang
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Belum Punya Akun?{" "}
        <Link
          style={{
            textDecoration: "none",
            color: "var(--mantine-color-blue-6)",
          }}
          href={`/register?redirect=${redirect}`}
        >
          Buat Akun Disini
        </Link>
      </Text>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Lupa Password?{" "}
        <Link
          style={{
            textDecoration: "none",
            color: "var(--mantine-color-blue-6)",
          }}
          href="/forgot"
        >
          Disini
        </Link>
      </Text>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Jika ada kendala dalam mengakses akun, silakan hubungi admin melalui
        Whatsapp di{" "}
        <Anchor
          size="sm"
          component="a"
          href="https://wa.me/6285156168499?text=Hai%20Kak%2C%20saya%20ingin%20bertanya...%0A%0ANama%20lengkap%20%3A%20%0AEmail%20%3A%20%0AAsal%20Universitas%20%3A%20%0APertanyaan%2FMasalah%20%3A%20"
        >
          +62 851 5616 8499
        </Anchor>
      </Text>

      <Paper withBorder p={30} mt={24} radius="md">
        <LoginForm redirect={redirect as string | undefined} />
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="default" fullWidth mt="xl">
            Kembali ke Beranda
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
