import type { ReactElement } from "react";
import PageHero from "@/components/layout/PageHero";
import { Text } from "@mantine/core";
import illustration from "@/assets/activitiespage-1.svg";
import PageContainer from "@/components/layout/PageContainer";
import Calendar from "@/features/calendar/Calendar";

export const metadata = {
  title: "Kalender BMKA",
  description:
    "Jadwal kegiatan bersama BMKA Salman ITB. Lihat tanggal kegiatan dalam kalender bulanan dan agenda.",
};

export default function CalendarPage(): ReactElement {
  return (
    <>
      <PageHero
        title={
          <>
            Kalender{" "}
            <Text component="span" c="blue" inherit>
              BMKA
            </Text>
          </>
        }
        description="Temukan jadwal kegiatan bersama BMKA Salman ITB. Lihat agenda bulanan dan pilih acara untuk mengetahui detailnya."
        illustration={illustration}
      />
      <PageContainer>
        <Calendar />
      </PageContainer>
    </>
  );
}
