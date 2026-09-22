import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import { Button, Text, Title } from "@mantine/core";
import PageHero from "@/components/layout/PageHero";
import PageContainer from "@/components/layout/PageContainer";
import illustration from "@/assets/bmka-journey.svg";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import { KADERISASI_PROGRAMS, KADERISASI_STAGES } from "./content";
import ProgramIllustration from "./ProgramIllustration";
import classes from "./about.module.css";

export default function AboutPage(): ReactElement {
  return (
    <>
      <PageHero
        title={
          <>
            Mengenal{" "}
            <Text component="span" c="blue" inherit>
              BMKA Salman
            </Text>
          </>
        }
        description="Tempat belajar, bertumbuh, dan mengambil peran. Kenali BMKA Salman ITB serta perjalanan kaderisasi dari Jamaah hingga Kader Lanjut."
        illustration={illustration}
      >
        <nav className={classes.heroLinks} aria-label="Bagian halaman">
          <Button component="a" href="#tentang-bmka" variant="default">
            Tentang BMKA
          </Button>
          <Button component="a" href="#alur-kaderisasi">
            Lihat alur kaderisasi
          </Button>
        </nav>
      </PageHero>
      <PageContainer className={classes.page}>
        <section
          id="tentang-bmka"
          aria-labelledby="bmka-title"
          className={classes.introduction}
        >
          <div>
            <Text c="blue" fw={600} mb="sm">
              Berawal dari masjid, tumbuh bersama
            </Text>
            <Title order={2} id="bmka-title">
              Mengenal peran BMKA
            </Title>
          </div>
          <div className={classes.prose}>
            <p>
              <strong>Bidang Mahasiswa, Kaderisasi dan Alumni (BMKA)</strong>{" "}
              merupakan bidang di Masjid Salman ITB yang mengelola pembinaan
              mahasiswa, kaderisasi aktivis dari berbagai kampus, serta hubungan
              dengan alumni aktivis Salman.
            </p>
            <p>
              Melalui Kaderisasi Salman, Anda dapat menemukan kegiatan
              pembinaan, bergabung dengan klub dan kepanitiaan, serta mengelola
              riwayat keikutsertaan. Perjalanan ini memberi ruang untuk belajar
              bersama dan mengambil peran sesuai minat.
            </p>
          </div>
        </section>

        <section
          id="alur-kaderisasi"
          aria-labelledby="alur-title"
          className={classes.section}
        >
          <div className={classes.sectionHeading}>
            <Title order={2} id="alur-title">
              Alur Kaderisasi
            </Title>
            <Text c="dimmed" lh={1.7}>
              Empat jenjang, dengan proses belajar yang berlanjut. SSC, LMD, dan
              SPECTRA menghubungkan setiap tahap dalam perjalanan Anda.
            </Text>
          </div>
          <ol
            className={classes.journey}
            aria-label="Urutan jenjang kaderisasi"
          >
            {KADERISASI_STAGES.map((stage, index) => (
              <li key={stage.level} className={classes.stage}>
                <div className={classes.stageTop}>
                  <Title order={3} size="h4">
                    {USER_LEVEL_RENDER[stage.level]}
                  </Title>
                  {index < KADERISASI_STAGES.length - 1 ? (
                    <svg
                      className={classes.connector}
                      viewBox="0 0 40 20"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M2 10H35M28 3L35 10 28 17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <Text fw={600} size="sm" mt="sm">
                  {stage.program}
                </Text>
                <Text size="sm" c="dimmed" lh={1.7} mt="xs">
                  {stage.description}
                </Text>
              </li>
            ))}
          </ol>

          <div className={classes.programs}>
            {KADERISASI_PROGRAMS.map((program) => (
              <article
                key={program.id}
                className={classes.program}
                aria-labelledby={`${program.id}-title`}
              >
                <div className={classes.programVisual}>
                  <ProgramIllustration program={program.id} />
                </div>
                <div>
                  <Text size="sm" c="blue" fw={600} mb="xs">
                    {USER_LEVEL_RENDER[program.from]} →{" "}
                    {USER_LEVEL_RENDER[program.to]}
                  </Text>
                  <Title order={3} id={`${program.id}-title`}>
                    {program.name}{" "}
                    <span className={classes.programName}>
                      / {program.title}
                    </span>
                  </Title>
                  <Text fw={600} mt="md">
                    {program.focus}
                  </Text>
                  <Text c="dimmed" lh={1.8} mt="xs">
                    {program.description}
                  </Text>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="level-title" className={classes.explanation}>
          <div>
            <Title order={2} id="level-title" size="h3">
              Bagaimana jenjang Anda tercatat?
            </Title>
            <p>
              Portal menggunakan riwayat keikutsertaan kaderisasi yang tercatat
              pada profil. Riwayat SSC terkait dengan jenjang Aktivis, LMD
              dengan Kader, dan SPECTRA dengan Kader Lanjut. Jika ada lebih dari
              satu riwayat, jenjang tertinggi yang digunakan.
            </p>
          </div>
          <div>
            <Title order={3} size="h4">
              Perhatikan jenjang minimum kegiatan
            </Title>
            <p>
              Setiap kegiatan dapat memiliki syarat jenjang minimum. Misalnya,
              kegiatan dengan minimum Aktivis dapat diikuti oleh Aktivis, Kader,
              dan Kader Lanjut, dengan tetap memenuhi persyaratan lain pada
              halaman kegiatan.
            </p>
            <p>
              Mendaftar kegiatan saja tidak langsung mengubah jenjang. Pastikan
              riwayat kaderisasi pada profil Anda sesuai dengan keikutsertaan
              Anda.
            </p>
          </div>
        </section>

        <section className={classes.nextStep} aria-labelledby="next-title">
          <div>
            <Title order={2} id="next-title">
              Mulai dari langkah Anda hari ini
            </Title>
            <Text c="dimmed" mt="sm" lh={1.7}>
              Temukan kegiatan yang sesuai dengan jenjang Anda dan baca
              persyaratan pendaftarannya.
            </Text>
          </div>
          <div className={classes.actions}>
            <LinkButton href="/activity">Lihat kegiatan</LinkButton>
            <LinkButton href="/tentang/kalender-bmka" variant="default">
              Kalender BMKA
            </LinkButton>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
