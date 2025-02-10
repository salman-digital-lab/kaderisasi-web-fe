import MonthlyLeaderboard from "@/features/leaderboard/MonthlyLeaderboard";
import illustration from "@/assets/ruangcurhatpage-1.svg";
import Image from "next/image";
import { Button, Group } from "@mantine/core";
import classes from "./page.module.css";
import { Container, Text } from "@mantine/core";

const LeaderboardPage = () => {
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
              Leaderboard merupakan daftar peringkat pengguna berdasarkan skor
              yang diperoleh. Skor diperoleh dari prestasi yang dilakukan
              pengguna.
            </Text>
            <Group mt={30}>
              <Button size="md" className={classes.control}>
                Masukkan Prestasi Anda Disini
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
      <MonthlyLeaderboard />
    </main>
  );
};

export default LeaderboardPage;
