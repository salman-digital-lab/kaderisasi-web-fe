import {
  Group,
  Divider,
  Drawer,
  ScrollArea,
  rem,
  Anchor,
  Avatar,
  Text,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Stack,
  Button,
} from "@mantine/core";

import { IconLogout, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

import classes from "../index.module.css";
import logout from "../../../../functions/server/logout";

type NavDrawer = {
  drawerOpened: boolean;
  closeDrawer: () => void;
  session: { name?: string; session?: string };
};

export default function NavDrawer({
  drawerOpened,
  closeDrawer,
  session,
}: NavDrawer) {
  return (
    <Drawer
      opened={drawerOpened}
      onClose={closeDrawer}
      size="100%"
      padding="md"
      title="Menu"
      hiddenFrom="sm"
      zIndex={1000000}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Divider my="sm" />

        <Anchor href="/" className={classes.link} underline="never">
          Beranda
        </Anchor>

        <Anchor href="/activity" className={classes.link} underline="never">
          Kegiatan
        </Anchor>

        <Anchor href="/consultation" className={classes.link} underline="never">
          Ruang Curhat
        </Anchor>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          {session.session ? (
            <Accordion variant="filled">
              <AccordionItem value="profile">
                <AccordionControl>
                  <Group>
                    <Avatar radius="xl" />
                    <Text size="md">{session.name}</Text>
                  </Group>
                </AccordionControl>
                <AccordionPanel>
                  <Stack>
                    <Anchor
                      component={Link}
                      href="/profile"
                      className={classes.link}
                      underline="never"
                    >
                      <IconSettings
                        style={{
                          width: rem(16),
                          height: rem(16),
                          marginRight: rem(8),
                        }}
                      />
                      Profil
                    </Anchor>

                    <Anchor
                      component="button"
                      className={classes.link}
                      underline="never"
                      c="red"
                      onClick={() => {
                        logout();
                        closeDrawer();
                      }}
                    >
                      <IconLogout
                        style={{
                          width: rem(16),
                          height: rem(16),
                          marginRight: rem(8),
                        }}
                      />
                      Keluar
                    </Anchor>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ) : (
            <>
              <Button component={Link} variant="default" href="/login">
                Masuk
              </Button>
              <Button component={Link} href="/register">
                Daftar
              </Button>
            </>
          )}
        </Group>
      </ScrollArea>
    </Drawer>
  );
}
