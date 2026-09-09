"use client";

import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import type { ReactElement } from "react";
import { useTransition } from "react";
import logout from "@/functions/server/logout";

export default function LogoutAction(): ReactElement {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="light"
      color="red"
      fullWidth
      leftSection={<IconLogout size={16} aria-hidden />}
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          await logout();
        })
      }
    >
      Keluar
    </Button>
  );
}
