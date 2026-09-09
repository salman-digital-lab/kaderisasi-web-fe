"use client";

import { Button, Group } from "@mantine/core";
import { useEffect } from "react";
import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";
import LinkButton from "@/components/common/LinkButton";

export default function ErrorWrapper({
  message,
  reset,
}: {
  message: string;
  reset?: () => void;
}): ReactElement {
  useEffect(() => {
    console.error(message);
  }, [message]);
  return (
    <PageState title="Halaman belum dapat dimuat" description={message}>
      <Group justify="center">
        {reset && <Button onClick={reset}>Coba lagi</Button>}
        <LinkButton href="/" variant="default">
          Kembali ke Beranda
        </LinkButton>
      </Group>
    </PageState>
  );
}
