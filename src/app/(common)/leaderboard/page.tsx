import PageHero from "@/components/layout/PageHero";
import illustration from "@/assets/leaderboardpage-1.svg";
import { Text } from "@mantine/core";
import MonthlyLeaderboard from "@/features/leaderboard/MonthlyLeaderboard";

export const metadata = {
  title: "Leaderboard",
  description:
    "Leaderboard Aktivis Salman - Himpunan prestasi akademik, kompetisi, dan organisasi aktivis. Lihat 10 besar aktivis berprestasi dan submit prestasimu!",
};

export default function LeaderboardPage() {
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
            setiap bulan. Ayo submit prestasi akademik, kompetisi, dan
            organisasi mu disini!
          </>
        }
        illustration={illustration}
      ></PageHero>

      <MonthlyLeaderboard />
    </>
  );
}
