import Link from "next/link";
import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_UPDATED_DATE,
  type LegalSection,
} from "./content";
import classes from "./legal.module.css";

type Props = {
  title: string;
  englishTitle: string;
  introduction: string;
  sections: LegalSection[];
  relatedHref: string;
  relatedTitle: string;
};

export default function LegalPage({
  title,
  englishTitle,
  introduction,
  sections,
  relatedHref,
  relatedTitle,
}: Props): ReactElement {
  return (
    <Container size="md" py="xl">
      <Paper
        withBorder
        radius="md"
        p={{ base: "lg", sm: "xl" }}
        component="article"
        className={classes.article}
      >
        <Stack gap="xl">
          <header>
            <Link href="/" className={classes.link}>
              Kembali ke beranda
            </Link>
            <Text size="sm" c="dimmed" mt="lg">
              Kaderisasi Salman · {englishTitle}
            </Text>
            <Title order={1} size="h2" mt="xs">
              {title}
            </Title>
            <Text size="sm" c="dimmed" mt="sm">
              Terakhir diperbarui: {LEGAL_UPDATED_DATE}
            </Text>
            <Text mt="lg" lh={1.8}>
              {introduction}
            </Text>
          </header>
          <nav aria-label="Daftar isi" className={classes.contents}>
            <Text fw={600} mb="sm">
              Daftar isi
            </Text>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a className={classes.link} href={`#${section.id}`}>
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <a className={classes.link} href="#kontak">
                  Hubungi pengelola
                </a>
              </li>
            </ol>
          </nav>
          {sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={classes.section}
              aria-labelledby={`${section.id}-title`}
            >
              <Title order={2} size="h4" id={`${section.id}-title`} mb="sm">
                {index + 1}. {section.title}
              </Title>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} mt="sm" lh={1.8}>
                  {paragraph}
                </Text>
              ))}
            </section>
          ))}
          <section
            id="kontak"
            className={classes.section}
            aria-labelledby="kontak-title"
          >
            <Title order={2} size="h4" id="kontak-title" mb="sm">
              {sections.length + 1}. Hubungi pengelola
            </Title>
            <Text lh={1.8}>
              Pertanyaan mengenai layanan, privasi, atau permintaan penghapusan
              akun dan data dapat disampaikan kepada tim pengelola BMKA Salman
              ITB melalui{" "}
              <a
                className={classes.link}
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </Text>
          </section>
          <div className={classes.related}>
            <Link className={classes.link} href={relatedHref}>
              {relatedTitle}
            </Link>
            <a
              className={classes.link}
              href="https://policies.google.com/privacy"
            >
              Kebijakan Privasi Google
            </a>
            <a
              className={classes.link}
              href="https://myaccount.google.com/connections"
            >
              Kelola koneksi Akun Google
            </a>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}
