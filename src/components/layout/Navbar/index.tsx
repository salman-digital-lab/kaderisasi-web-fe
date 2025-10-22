import Image from "next/image";
import Link from "next/link";
import {
  Group,
  Box,
  rem,
  Anchor,
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  MenuDivider,
  Text,
  Button,
} from "@mantine/core";
import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import { IconSettings } from "@tabler/icons-react";
import ClientNavbar from "./components/ClientNavbar";
import { verifySession } from "../../../functions/server/session";
import LogoutButton from "./components/LogoutButton";
import ProfilePictureNav from "@/features/profile/ProfilePictureNav";
export default async function Navbar() {
  const sessionData = await verifySession();

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image src={logo} alt="bmka" width={100} />
          </Link>

          <Group h="100%" gap={0} visibleFrom="md">
            <Anchor href="/activity" className={classes.link} underline="never">
              Kegiatan
            </Anchor>

            <Anchor href="/clubs" className={classes.link} underline="never">
              Unit Kegiatan & Kepanitiaan
            </Anchor>

            <Anchor
              href="/consultation"
              className={classes.link}
              underline="never"
            >
              Ruang Curhat
            </Anchor>

            <Anchor
              href="/leaderboard"
              className={classes.link}
              underline="never"
            >
              Leaderboard
            </Anchor>
          </Group>

          {sessionData.session ? (
            <Group visibleFrom="md" className={classes.link}>
              <Menu shadow="md" width={200}>
                <MenuTarget>
                  <Group>
                    <ProfilePictureNav
                      token={sessionData.session || ""}
                      src={sessionData.profilePicture}
                    />
                    <Text size="md">{sessionData.name}</Text>
                  </Group>
                </MenuTarget>

                <MenuDropdown>
                  <Link href="/profile" style={{ textDecoration: 'none' }}>
                    <MenuItem
                      leftSection={
                        <IconSettings
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Profile
                    </MenuItem>
                  </Link>

                  <MenuDivider />

                  <LogoutButton />
                </MenuDropdown>
              </Menu>
            </Group>
          ) : (
            <Group visibleFrom="md">
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="default">Masuk</Button>
              </Link>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Button>Daftar</Button>
              </Link>
            </Group>
          )}
          <ClientNavbar session={sessionData} />
        </Group>
      </header>
    </Box>
  );
}
