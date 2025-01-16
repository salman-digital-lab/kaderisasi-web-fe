"use client";

import { Burger } from "@mantine/core";
import NavDrawer from "./Drawer";
import { useDisclosure } from "@mantine/hooks";

export default function ClientNavbar({
  session,
}: {
  session: { name?: string; session?: string };
}) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
      <NavDrawer
        drawerOpened={drawerOpened}
        closeDrawer={closeDrawer}
        session={session}
      />
    </>
  );
}
