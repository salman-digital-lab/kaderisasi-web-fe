import Image from "next/image";
import Link from "next/link";
import { Paper, Title, Container, Button } from "@mantine/core";

import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm";

export default function Page() {
  return (
    <Container size={420} my={40}>
      <div className={classes.logo}>
        <Image src={logo} alt="bmka" fill />
      </div>

      <Title ta="center" className={classes.title}>
        Ubah Password
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <ResetPasswordForm />

        <Button variant="default" fullWidth mt="xl" component={Link} href="/">
          Kembali ke Beranda
        </Button>
      </Paper>
    </Container>
  );
}
