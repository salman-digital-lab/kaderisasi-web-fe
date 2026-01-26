import Image from "next/image";
import { Button, Card, Container, Text, Title } from "@mantine/core";
import classes from "./index.module.css";
import illustration from "@/assets/ruangcurhatpage-1.svg";
import RegistrationForm from "../../../features/ruangcurhat/RegistrationForm";
import { verifySession } from "../../../functions/server/session";
import { getProfile } from "@/services/profile";
import ErrorWrapper from "@/components/layout/Error";
import { PublicUser, Member } from "@/types/model/members";
import Link from "next/link";

export const metadata = {
  title: "Ruang Curhat",
  description:
    "Ruang Curhat Kaderisasi Salman - Layanan konseling sebaya oleh Aktivis Salman terlatih. Ceritakan masalahmu, kami siap mendengarkan dan membersamai.",
};

export default async function Home() {
  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  const sessionData = await verifySession();

  try {
    profileData = await getProfile(sessionData.session || "");
  } catch (error: unknown) {
    if (typeof error === "string" && error !== "Unauthorized")
      return <ErrorWrapper message={error} />;
  }

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
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
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
        <Title ta="center" mt="sm" className={classes.sectionTitle}>
          Pendaftaran Sesi Curhat
        </Title>

        <Text
          c="dimmed"
          className={`${classes.description_list} ${classes.sectionDescription}`}
          ta="center"
          mt="md"
        >
          Tak ada masalah yang terlalu kecil untuk diceritakan dan setiap cerita
          sama berharganya untuk didengarkan. Isi formulir berikut untuk
          mendaftar konseling di Ruang Curhat. Selesai mengisi formulir, Tim
          Ruang Curhat akan segera menghubungimu.
        </Text>

        <Container size="sm">
          {sessionData.session ? (
            <RegistrationForm
              token={sessionData.session || ""}
              whatsapp={profileData?.profile.whatsapp}
              gender={profileData?.profile.gender}
              birthDate={profileData?.profile.birth_date}
            />
          ) : (
            <Card padding="xl" radius="md" withBorder mt="xl">
              <Text
                ta="center"
                c="dimmed"
                fw="bold"
                className={classes.loginPrompt}
              >
                Silahkan masuk ke akun anda terlebih dahulu untuk menggunakan
                layanan Ruang Curhat
              </Text>
              <Link
                href={`/login?redirect=${process.env.NEXT_PUBLIC_APP_URL}/consultation`}
                style={{ textDecoration: "none" }}
              >
                <Button fullWidth mt="md">
                  Masuk
                </Button>
              </Link>
            </Card>
          )}
        </Container>
      </Container>
    </main>
  );
}
