import illustration from "@/assets/leaderboardpage-1.svg";
import Image from "next/image";
import { Suspense } from "react";
import classes from "./page.module.css";
import { Container, Text } from "@mantine/core";
import { verifySession } from "@/functions/server/session";
import LeaderboardContent from "@/components/leaderboard/LeaderboardContent";
import { LeaderboardSkeleton } from "@/components/skeletons";

export const metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const sessionData = await verifySession();

  return (
    <main>
      {/* Hero Section - Static content, renders immediately */}
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              Leaderboard{" "}
              <Text component="span" c="blue" inherit>
                Kaderisasi Salman
              </Text>
            </h1>
            <Text c="dimmed" mt="md" className={classes.heroDescription}>
              Leaderboard merupakan website tempat menghimpun prestasi aktivis
              Salman. Pengguna dengan skoring tertinggi akan tampil dalam 10
              besar sepanjang masa. Ayo submit prestasi akademik, kompetisi,
              dan organisasi mu disini!
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

      {/* Leaderboard Content - Streamed with Suspense */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent
          userSession={sessionData.session}
          userName={sessionData.name}
        />
      </Suspense>
    </main>
  );
}
