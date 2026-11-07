"use client";

import { Alert, Button, Stack, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { ReactElement } from "react";
import { confirmEmailChange } from "@/functions/server/emailChange";

type State =
  | { kind: "ready" }
  | { kind: "done"; email: string }
  | { kind: "failed"; message: string };

function Component(): ReactElement {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [state, setState] = useState<State>({ kind: "ready" });
  const [busy, setBusy] = useState(false);

  // Confirming takes a click: link scanners in mail apps open the page too.
  const confirm = async () => {
    setBusy(true);
    const result = await confirmEmailChange(token);
    setBusy(false);
    setState(
      result.success && result.data
        ? { kind: "done", email: result.data.email }
        : { kind: "failed", message: result.message },
    );
  };

  if (!token) {
    return (
      <Alert color="red">
        Tautan tidak lengkap. Buka tautan dari email konfirmasi.
      </Alert>
    );
  }
  if (state.kind === "done") {
    return (
      <Stack>
        <Alert color="green" title="Email berhasil diubah">
          Email akun Anda sekarang <b>{state.email}</b>. Gunakan email ini
          setiap kali masuk.
        </Alert>
        <Button onClick={() => router.push("/profile")}>Ke profil</Button>
      </Stack>
    );
  }
  return (
    <Stack>
      {state.kind === "failed" && <Alert color="red">{state.message}</Alert>}
      <Text size="sm">
        Klik tombol di bawah untuk menjadikan email ini sebagai email akun Anda.
      </Text>
      <Button onClick={confirm} loading={busy} fullWidth>
        Konfirmasi email
      </Button>
    </Stack>
  );
}

export default function ConfirmEmail(): ReactElement {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
}
