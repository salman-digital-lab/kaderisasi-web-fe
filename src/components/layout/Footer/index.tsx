"use client";

import Link from "next/link";
import { Anchor, Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";

import classes from "./index.module.css";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.bottomNote}>
        <Text c="dimmed" className={classes.description}>
          Portal ini dikelola penuh oleh Masjid Salman ITB Bidang Mahasiswa,
          Kaderisasi dan Alumni (BMKA).
        </Text>
      </Container>
      <Container>
        <Group
          justify="center"
          gap="lg"
          mt="sm"
          component="nav"
          aria-label="Informasi hukum"
        >
          <Anchor component={Link} href="/privacy-policy" size="sm">
            Kebijakan Privasi
          </Anchor>
          <Anchor component={Link} href="/terms-of-service" size="sm">
            Syarat dan Ketentuan
          </Anchor>
        </Group>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="md" className={classes.copyright}>
          © 2026 BMKA Salman ITB All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            component="a"
            href="#"
            size="md"
            color="gray"
            variant="subtle"
          >
            <IconBrandTwitter
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="#"
            size="md"
            color="gray"
            variant="subtle"
          >
            <IconBrandYoutube
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="#"
            size="md"
            color="gray"
            variant="subtle"
          >
            <IconBrandInstagram
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
