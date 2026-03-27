"use client";

import { Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";

import classes from "./index.module.css";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.groups}>
          <div className={classes.wrapper}>
            <Text className={classes.title}>Alamat</Text>
            <Text className={classes.link}>
              Jl. Ganesa No.7, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung,
              Jawa Barat 40132
            </Text>
            <Text className={classes.link}>+62 851-5616-8499</Text>
          </div>
        </div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm" className={classes.copyright}>
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
      <Container className={classes.bottomNote}>
        <Text c="dimmed" className={classes.description}>
          Portal ini dikelola penuh oleh Masjid Salman ITB Bidang Mahasiswa,
          Kaderisasi dan Alumni (BMKA).
        </Text>
      </Container>
    </footer>
  );
}
