import LifetimeLeaderboard from "@/features/leaderboard/LifetimeLeaderboard";
import illustration from "@/assets/leaderboardpage-1.svg";
import Image from "next/image";
import { Button, Group } from "@mantine/core";
import classes from "./page.module.css";
import { Container, Text } from "@mantine/core";
import Link from "next/link";
import { verifySession } from "@/functions/server/session";

const LeaderboardPage = async () => {
  const sessionData = await verifySession();
  return (
    <main>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Leaderboard{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md">
              Leaderboard merupakan website tempat menghimpun prestasi aktivis
              Salman. Pengguna dengan skoring tertinggi akan tampil dalam 10
              besar sepanjang masa. Ayo submit prestasi akademik, kompetisi,
              dan organisasi mu disini!
            </Text>
            <Group mt={30}>
              <Link href="/leaderboard/submit" style={{ textDecoration: 'none' }}>
                <Button size="md" className={classes.control}>
                  Masukkan Prestasi Anda Disini
                </Button>
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
      <LifetimeLeaderboard 
        userSession={sessionData.session} 
        userName={sessionData.name} 
      />
    </main>
  );
};

export default LeaderboardPage;
