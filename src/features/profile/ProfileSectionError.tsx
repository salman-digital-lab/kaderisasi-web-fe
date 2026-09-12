"use client";
import { Alert, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ReactElement } from "react";
export default function ProfileSectionError({
  message,
}: {
  message: string;
}): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Alert title="Data belum tersedia" color="red" role="alert">
      {message}
      <Button
        display="block"
        mt="sm"
        variant="outline"
        loading={pending}
        onClick={() => startTransition(() => router.refresh())}
      >
        Coba lagi
      </Button>
    </Alert>
  );
}
