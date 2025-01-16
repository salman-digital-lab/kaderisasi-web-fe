import Image from "next/image";
import Link from "next/link";
import { Paper, Title, Container, Button } from "@mantine/core";

import logo from "@/assets/bmka_logo_color.png";
import ForgotForm from "@/features/auth/ForgotForm";

import classes from "./index.module.css";

export default function Page() {
  return (
    <Container size={420} my={40}>
      <div className={classes.logo}>
        <Image src={logo} alt="bmka" fill />
      </div>

      <Title ta="center" className={classes.title}>
        Lupa Password
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <ForgotForm />
        <Button variant="default" fullWidth mt="xl" component={Link} href="/">
          Kembali ke Beranda
        </Button>
      </Paper>
    </Container>
  );
}
