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
  Avatar,
  Text,
  Button,
} from "@mantine/core";
import logo from "@/assets/bmka_logo_color.png";

import classes from "./index.module.css";
import { IconSettings, IconLogout } from "@tabler/icons-react";
import ClientNavbar from "./components/ClientNavbar";
import { verifySession } from "../../../functions/server/session";
import LogoutButton from "./components/LogoutButton";

export default async function Navbar() {
  const sessionData = await verifySession();

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Image src={logo} alt="bmka" width={100} />

          <Group h="100%" gap={0} visibleFrom="sm">
            <Anchor href="/" className={classes.link} underline="never">
              Beranda
            </Anchor>

            <Anchor href="/activity" className={classes.link} underline="never">
              Kegiatan
            </Anchor>

            <Anchor
              href="/consultation"
              className={classes.link}
              underline="never"
            >
              Ruang Curhat
            </Anchor>
          </Group>

          {sessionData.session ? (
            <Group visibleFrom="sm" className={classes.link}>
              <Menu shadow="md" width={200}>
                <MenuTarget>
                  <Group>
                    <Avatar radius="xl" />
                    <Text size="md">{sessionData.name}</Text>
                  </Group>
                </MenuTarget>

                <MenuDropdown>
                  <MenuItem
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                    component={Link}
                    href="/profile"
                  >
                    Profile
                  </MenuItem>

                  <MenuDivider />

                  <LogoutButton />
                </MenuDropdown>
              </Menu>
            </Group>
          ) : (
            <Group visibleFrom="sm">
              <Button component={Link} variant="default" href="/login">
                Masuk
              </Button>
              <Button component={Link} href="/register">
                Daftar
              </Button>
            </Group>
          )}
          <ClientNavbar session={sessionData} />
        </Group>
      </header>
    </Box>
  );
}
