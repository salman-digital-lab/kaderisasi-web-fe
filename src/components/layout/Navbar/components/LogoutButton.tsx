"use client";

import { MenuItem, rem } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import logout from "../../../../functions/server/logout";

export default function LogoutButton() {
  return (
    <MenuItem
      color="red"
      leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
      onClick={() => logout()}
    >
      Keluar
    </MenuItem>
  );
}
