import Image from "next/image";
import Link from "next/link";
import { Anchor, Paper, Title, Text, Container, Button } from "@mantine/core";

import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import RegistrationForm from "../../features/auth/RegistrationForm";

export const metadata = {
  title: "Daftar",
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
        Sudah Punya Akun?{" "}
        <Anchor size="sm" component={Link} href={`/login?redirect=${redirect}`}>
          Silahkan Masuk Disini
        </Anchor>
      </Text>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Jika ada kendala dalam registrasi akun, silakan hubungi admin melalui
        Whatsapp di{" "}
        <Anchor
          size="sm"
          component={Link}
          href="https://wa.me/6285156168499?text=Hai%20Kak%2C%20saya%20ingin%20bertanya...%0A%0ANama%20lengkap%20%3A%20%0AEmail%20%3A%20%0AAsal%20Universitas%20%3A%20%0APertanyaan%2FMasalah%20%3A%20"
        >
          +62 851 5616 8499
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={24} radius="md">
        <RegistrationForm />
        <Button variant="default" fullWidth mt="xl" component={Link} href="/">
          Kembali ke Beranda
        </Button>
      </Paper>
    </Container>
  );
}
