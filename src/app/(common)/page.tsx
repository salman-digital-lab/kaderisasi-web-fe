import Image from "next/image";
import {
  Container,
  Text,
  Button,
  Group,
  Title,
  SimpleGrid,
  Stack,
  Center,
} from "@mantine/core";
import classes from "./index.module.css";
import ActivityCard from "../../components/common/ActivityCard";
import illustration from "@/assets/homepage-1.svg";
import Link from "next/link";
import { getActivities } from "../../services/activity";

export const metadata = {
  title: "Beranda",
};

export default async function Home() {
  const { data: activities } = await getActivities({ per_page: "4" });

  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Selamat Datang di{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md">
              Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan,
              Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat
              pendaftaran kegiatan di @kaderisasisalman. Program pembinaan dalam
              rangka membentuk kader teladan untuk membangun Indonesia.
            </Text>

            <Group mt={30}>
              <Button size="md" component={Link} href="/activity">
                Daftar Kegiatan Sekarang
              </Button>
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

      <Container size="lg" py="xl">
        <Title ta="center" mt="sm" order={1}>
          Bersama Membangun Generasi Pemimpin Masa Depan
        </Title>
        <Text
          c="dimmed"
          className={classes.description_list}
          ta="center"
          mt="md"
          mb="xl"
          size="lg"
        >
          Bergabunglah bersama lebih dari <b>45.000</b> mahasiswa dan{" "}
          <b>320</b> kampus di seluruh Indonesia yang telah berkontribusi
          membangun negeri melalui Kaderisasi Salman. Kami telah membentuk
          generasi pemimpin masa depan yang siap menghadapi tantangan masa
          depan.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
          <Stack align="center" justify="center">
            <Title order={2} c="blue" size="h1">
              45.000+
            </Title>
            <Text c="dimmed" size="lg" ta="center">
              Mahasiswa
            </Text>
          </Stack>
          <Stack align="center" justify="center">
            <Title order={2} c="blue" size="h1">
              320+
            </Title>
            <Text c="dimmed" size="lg" ta="center">
              Kampus
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <Container size="lg" py="xl">
        <Title ta="center" mt="sm">
          Kegiatan Baru
        </Title>

        <Text
          c="dimmed"
          className={classes.description_list}
          ta="center"
          mt="md"
        >
          Jelajahi dan saksikan peluang kegiatan yang dapat membantu Anda
          mengasah potensi dan kontribusi unik Anda dalam lingkungan yang
          mendukung.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activityName={activity.name}
              minimumLevel={activity.minimum_level}
              registrationEnd={activity.registration_end}
              slug={activity.slug}
              imageUrl={
                activity.additional_config?.images?.length &&
                activity.additional_config?.images?.length > 0
                  ? activity.additional_config.images[0]
                  : undefined
              }
            />
          ))}
        </SimpleGrid>
        {activities.length > 3 && (
          <Center>
            <Button size="md" mt="md" component={Link} href="/activity">
              Lihat Kegiatan Lainnya
            </Button>
          </Center>
        )}
      </Container>

      <Container size="lg" py="xl">
        <Stack
          mt={150}
          bg="var(--mantine-color-body)"
          align="center"
          justify="center"
          gap="md"
        >
          <Title className={classes.description_list} ta="center">
            Butuh Dukungan Kesehatan Mental? Ruang Curhat Ada Untukmu.
          </Title>
          <Text ta="center">
            Ruang Curhat merupakan layanan konseling sebaya yang diberikan oleh
            sesama aktivis salman. Aktivis salman yang akan membersamai kamu,
            sudah mendapatkan pelatihan dan bekal-bekal pengetahuan psikologi
            praktis untuk menjadi seorang konselor lho.
          </Text>
          <Button
            component={Link}
            size="md"
            href="/consultation"
            w="max-content"
          >
            Ayo Curhat
          </Button>
        </Stack>
      </Container>
    </main>
  );
}
