import PageHero from "@/components/layout/PageHero";
import illustration from "@/assets/leaderboardpage-1.svg";
import { Suspense } from "react";
import { Text } from "@mantine/core";
import { verifySession } from "@/functions/server/session";
import LeaderboardContent from "@/components/leaderboard/LeaderboardContent";
import { LeaderboardSkeleton } from "@/components/skeletons";

export const metadata = {
  title: "Leaderboard",
  description:
    "Leaderboard Aktivis Salman - Himpunan prestasi akademik, kompetisi, dan organisasi aktivis. Lihat 10 besar aktivis berprestasi dan submit prestasimu!",
};

export default async function LeaderboardPage() {
  const sessionData = await verifySession();

  return (
    <>
      {/* Hero Section - Static content, renders immediately */}
      <PageHero
        title={
          <>
            Leaderboard{" "}
            <Text component="span" c="blue" inherit>
              Kaderisasi Salman
            </Text>
          </>
        }
        description={
          <>
            Leaderboard merupakan website tempat menghimpun prestasi aktivis
            Salman. Pengguna dengan skoring tertinggi akan tampil dalam 10 besar
            sepanjang masa. Ayo submit prestasi akademik, kompetisi, dan
            organisasi mu disini!
          </>
        }
        illustration={illustration}
      ></PageHero>

      {/* Leaderboard Content - Streamed with Suspense */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent
          userSession={sessionData.session}
          userName={sessionData.name}
        />
      </Suspense>
    </>
  );
}
