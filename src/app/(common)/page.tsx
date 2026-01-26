import Image from "next/image";
import { Suspense } from "react";
import {
  Container,
  Text,
  Button,
  Group,
  Title,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import classes from "./index.module.css";
import illustration from "@/assets/homepage-1.svg";
import Link from "next/link";
import ActivitiesSection from "@/components/home/ActivitiesSection";
import ClubsSection from "@/components/home/ClubsSection";
import ActivitiesSectionSkeleton from "@/components/home/ActivitiesSectionSkeleton";
import ClubsSectionSkeleton from "@/components/home/ClubsSectionSkeleton";

export const metadata = {
  title: "Beranda",
  description:
    "Portal Aktivis Salman - Pusat pendaftaran kegiatan kaderisasi, pembinaan mahasiswa, dan pengembangan diri bersama lebih dari 45.000 mahasiswa dari 320 kampus di Indonesia.",
};

export default function Home() {
  return (
    <main>
      {/* Hero Section - No data fetching, renders immediately */}
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Selamat Datang di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
              Portal Aktivis Salman yang dikelola BMKA (Bidang Mahasiswa,
              Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat
              pendaftaran kegiatan di @kaderisasisalman. Program pembinaan dalam
              rangka membentuk kader teladan untuk membangun Indonesia.
            </Text>

            <Group mt={30}>
              <Link href="/activity" style={{ textDecoration: "none" }}>
                <Button size="md">Daftar Kegiatan Sekarang</Button>
              </Link>
            </Group>
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

      {/* Statistics Section - Static content, no data fetching */}
      <Container size="lg" py="xl">
        <Title ta="center" mt="sm" order={1} className={classes.sectionTitle}>
          Bersama Membangun Generasi Pemimpin Masa Depan
        </Title>
        <Text
          c="dimmed"
          className={`${classes.description_list} ${classes.sectionDescription}`}
          ta="center"
          mt="md"
          mb="xl"
          size="lg"
        >
          Bergabunglah bersama lebih dari <b>45.000</b> mahasiswa dan <b>320</b>{" "}
          kampus di seluruh Indonesia yang telah berkontribusi membangun negeri
          melalui Kaderisasi Salman. Kami telah membentuk generasi pemimpin masa
          depan yang siap menghadapi tantangan masa depan.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <Stack align="center" justify="center">
            <Title order={2} c="blue" size="h1" className={classes.statNumber}>
              45.000+
            </Title>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={classes.statLabel}
            >
              Mahasiswa
            </Text>
          </Stack>
          <Stack align="center" justify="center">
            <Title order={2} c="blue" size="h1" className={classes.statNumber}>
              320+
            </Title>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={classes.statLabel}
            >
              Kampus
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Activities Section - Streamed with Suspense */}
      <Suspense fallback={<ActivitiesSectionSkeleton />}>
        <ActivitiesSection />
      </Suspense>

      {/* Clubs Section - Streamed with Suspense */}
      <Suspense fallback={<ClubsSectionSkeleton />}>
        <ClubsSection />
      </Suspense>

      {/* CTA Section - Static content, no data fetching */}
      <Container size="lg" py="xl">
        <Stack
          mt={150}
          bg="var(--mantine-color-body)"
          align="center"
          justify="center"
          gap="md"
        >
          <Title
            className={`${classes.description_list} ${classes.sectionTitle}`}
            ta="center"
          >
            Butuh Dukungan Kesehatan Mental? Ruang Curhat Ada Untukmu.
          </Title>
          <Text ta="center" className={classes.sectionDescription}>
            Ruang Curhat merupakan layanan konseling sebaya yang diberikan oleh
            sesama aktivis salman. Aktivis salman yang akan membersamai kamu,
            sudah mendapatkan pelatihan dan bekal-bekal pengetahuan psikologi
            praktis untuk menjadi seorang konselor lho.
          </Text>
          <Link href="/consultation" style={{ textDecoration: "none" }}>
            <Button size="md" w="max-content">
              Ayo Curhat
            </Button>
          </Link>
        </Stack>
      </Container>
    </main>
  );
}
