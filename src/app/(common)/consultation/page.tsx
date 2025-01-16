import Image from "next/image";
import { Container, Text, Title } from "@mantine/core";
import classes from "./index.module.css";
import illustration from "@/assets/homepage-1.svg";
import RegistrationForm from "../../../features/ruangcurhat/RegistrationForm";
import { verifySession } from "../../../functions/server/session";

export default async function Home() {
  const sessionData = await verifySession();

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Ruang Curhat{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md">
              Ruang Curhat merupakan layanan konseling sebaya yang diberikan
              oleh sesama Aktivis Salman. Aktivis Salman yang akan membersamai
              kamu, sudah mendapatkan pelatihan dan bekal-bekal pengetahuan
              psikologi praktis untuk menjadi seorang konselor lho.
            </Text>
          </div>
          <Image
            width={400}
            src={illustration}
            alt="Selamat Datang di BMKA Salman ITB"
            priority
            className={classes.image}
          />
        </div>
      </Container>

      <Container size="lg" py="xl">
        <Title ta="center" mt="sm">
          Pendaftaran Sesi Konsultasi
        </Title>

        <Text
          c="dimmed"
          className={classes.description_list}
          ta="center"
          mt="md"
        >
          Silahkan mengisi formulir untuk mendapatkan sesi konseling sebaya
          dengan Aktivis Salman. Setelah anda berhasil mengirim formulir,
          Aktivis akan ditunjuk dan langsung menghubungi anda.
        </Text>

        <Container size="sm">
          <RegistrationForm token={sessionData.session || ""} />
        </Container>
      </Container>
    </main>
  );
}
