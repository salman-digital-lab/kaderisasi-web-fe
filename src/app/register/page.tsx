import Image from "next/image";
import Link from "next/link";
import { Anchor, Paper, Title, Text, Container, Button } from "@mantine/core";

import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import RegistrationForm from "../../features/auth/RegistrationForm";

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
        Sudah Punya Akun?{" "}
        <Anchor size="sm" component={Link} href="/login">
          Silahkan Masuk Disini
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <RegistrationForm />
        <Button variant="default" fullWidth mt="xl" component={Link} href="/">
          Kembali ke Beranda
        </Button>
      </Paper>
    </Container>
  );
}
