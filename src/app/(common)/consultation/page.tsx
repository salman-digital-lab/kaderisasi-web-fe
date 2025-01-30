import Image from "next/image";
import { Button, Container, Text, Title } from "@mantine/core";
import classes from "./index.module.css";
import illustration from "@/assets/homepage-1.svg";
import RegistrationForm from "../../../features/ruangcurhat/RegistrationForm";
import { verifySession } from "../../../functions/server/session";
import { getProfile } from "@/services/profile";
import ErrorWrapper from "@/components/layout/Error";
import { getActivity, getActivityRegistration } from "@/services/activity";
import { PublicUser, Member } from "@/types/model/members";
import Link from "next/link";

export const metadata = {
  title: "Ruang Curhat",
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
          {sessionData.session ? (
            <RegistrationForm
              token={sessionData.session || ""}
              whatsapp={profileData?.profile.whatsapp}
            />
          ) : (
            <>
              <Text ta="center" c="dimmed" fw="bold" fz="xl" mt="xl">
                Silahkan masuk ke akun anda terlebih dahulu untuk menggunakan
                ruang curhat
              </Text>
              <Button component={Link} fullWidth mt="md" href="/login">
                Masuk
              </Button>
            </>
          )}
        </Container>
      </Container>
    </main>
  );
}
