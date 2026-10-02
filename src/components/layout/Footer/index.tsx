import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { Container, SimpleGrid, Text } from "@mantine/core";
import { IconBrandWhatsapp, IconMail } from "@tabler/icons-react";
import logo from "@/assets/bmka_logo_color.png";
import { LEGAL_CONTACT_EMAIL } from "@/features/legal/content";
import CopyrightYear from "./CopyrightYear";
import classes from "./index.module.css";

const WHATSAPP_URL = "https://wa.me/6285156168499";

const EXPLORE_LINKS = [
  { href: "/activity", label: "Kegiatan" },
  { href: "/clubs", label: "Klub" },
  { href: "/kelas", label: "Kelas" },
  { href: "/consultation", label: "Ruang Curhat" },
];

const ABOUT_LINKS = [
  { href: "/tentang/bmka", label: "BMKA & Alur Kaderisasi" },
  { href: "/tentang/kalender-bmka", label: "Kalender BMKA" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}): ReactElement {
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className={classes.columnTitle}>
        {title}
      </h2>
      <ul className={classes.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={classes.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer(): ReactElement {
  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <SimpleGrid
          cols={{ base: 2, md: 4 }}
          spacing={{ base: "lg", md: "xl" }}
          verticalSpacing="lg"
          className={classes.main}
        >
          <div className={classes.fullOnMobile}>
            <Link
              href="/"
              aria-label="Kaderisasi Salman — Beranda"
              className={classes.logoLink}
            >
              <Image src={logo} alt="BMKA Salman ITB" width={120} />
            </Link>
            <Text size="sm" c="dimmed" mt="xs" className={classes.about}>
              Portal Kaderisasi Salman dikelola oleh Bidang Kemahasiswaan,
              Kaderisasi dan Alumni (BMKA) Masjid Salman ITB.
            </Text>
          </div>

          <LinkColumn title="Jelajahi" links={EXPLORE_LINKS} />
          <LinkColumn title="Tentang" links={ABOUT_LINKS} />

          <div className={classes.fullOnMobile}>
            <h2 className={classes.columnTitle}>Bantuan</h2>
            <ul className={classes.list}>
              <li>
                <a
                  href={WHATSAPP_URL}
                  className={classes.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandWhatsapp size={18} aria-hidden />
                  WhatsApp admin
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                  className={classes.link}
                >
                  <IconMail size={18} aria-hidden />
                  {LEGAL_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </SimpleGrid>

        <div className={classes.legal}>
          <div className={classes.legalRow}>
            <Text size="xs" c="dimmed">
              © <CopyrightYear /> BMKA Salman ITB. Hak cipta dilindungi.
            </Text>
            <nav aria-label="Informasi hukum">
              <ul className={classes.legalLinks}>
                <li>
                  <Link href="/privacy-policy" className={classes.legalLink}>
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className={classes.legalLink}>
                    Syarat dan Ketentuan
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <Text size="xs" c="dimmed" className={classes.disclosure}>
            Nama, email, dan data yang Anda isi digunakan untuk mengelola akun
            dan layanan yang Anda pilih. Pada dasbor admin, Masuk dengan Google
            menggunakan identitas akun, nama, email, dan status verifikasi email
            untuk autentikasi. Rincian tersedia pada{" "}
            <Link href="/privacy-policy#google" className={classes.inlineLink}>
              bagian Masuk dengan Google
            </Link>{" "}
            di Kebijakan Privasi.
          </Text>
        </div>
      </Container>
    </footer>
  );
}
