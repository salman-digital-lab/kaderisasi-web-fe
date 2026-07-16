"use client";

import { Alert, Button, Group } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ClubsListError() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Alert
      color="red"
      icon={<IconAlertCircle aria-hidden="true" />}
      title="Daftar klub belum dapat dimuat"
    >
      Terjadi kendala saat mengambil data. Periksa koneksi Anda lalu coba lagi.
      <Group mt="md">
        <Button
          color="red"
          variant="light"
          leftSection={<IconRefresh size={16} aria-hidden="true" />}
          loading={isPending}
          onClick={() => startTransition(() => router.refresh())}
        >
          Coba lagi
        </Button>
      </Group>
    </Alert>
  );
}
