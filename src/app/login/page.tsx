import Image from "next/image";
import { Anchor, Paper, Title, Text, Container, Button } from "@mantine/core";
import Link from "next/link";

import logo from "@/assets/bmka_logo_color.png";
import LoginForm from "../../features/auth/LoginForm";

import classes from "./index.module.css";

export default function Page() {
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
        <Anchor size="sm" component={Link} href="/register">
          Buat Akun Disini
        </Anchor>
      </Text>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Lupa Password?{" "}
        <Anchor size="sm" component={Link} href="/forgot">
          Disini
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
        <Button variant="default" fullWidth mt="xl" component={Link} href="/">
          Kembali ke Beranda
        </Button>
      </Paper>
    </Container>
  );
}
