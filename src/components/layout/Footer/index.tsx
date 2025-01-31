"use client";

import Image from "next/image";
import { Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";
import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import Link from "next/link";

const data = [
  {
    title: "Community",
    links: [
      { label: "Join Discord", link: "#" },
      { label: "Follow on Twitter", link: "#" },
      { label: "Email newsletter", link: "#" },
      { label: "GitHub discussions", link: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image src={logo} alt="bmka" width={150} />

          <Text size="sm" c="dimmed" className={classes.description}>
            Portal ini dikelola penuh oleh Masjid Salman ITB Bidang Mahasiswa,
            Kaderisasi dan Alumni (BMKA).
          </Text>
        </div>
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
        <Text c="dimmed" size="sm">
          © 2025 BMKA Salman ITB All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            component={Link}
            href="#"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            component={Link}
            href="#"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            component={Link}
            href="#"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
