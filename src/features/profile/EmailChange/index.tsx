"use client";

import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import showNotif from "@/functions/common/notification";
import {
  cancelEmailChange,
  getEmailChangeStatus,
  startEmailChange,
  verifyEmailChangeCode,
} from "@/functions/server/emailChange";
import type { EmailChangeStep } from "@/types/api/email-change";
import { RESTART_MESSAGES } from "./messages";

type Stage =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "form" }
  | { kind: "code"; email: string }
  | { kind: "sent"; email: string };

function stageFor(step: EmailChangeStep): Stage {
  return step.step === "code"
    ? { kind: "code", email: step.email }
    : { kind: "sent", email: step.email };
}

export default function EmailChange({
  currentEmail,
}: {
  currentEmail: string;
}): ReactElement {
  const [opened, setOpened] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [passwordRequired, setPasswordRequired] = useState(true);
  const [busy, setBusy] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) =>
        isEmail("Format email tidak valid")(value.trim()) ??
        (value.trim().toLowerCase() === currentEmail.toLowerCase()
          ? "Email baru sama dengan email sekarang"
          : null),
      password: (value) =>
        passwordRequired && !value ? "Password wajib diisi" : null,
    },
  });
  const codeForm = useForm({
    mode: "controlled",
    initialValues: { code: "" },
    validate: {
      code: (value) =>
        /^[0-9]{6}$/.test(value.trim()) ? null : "Kode terdiri dari 6 angka",
    },
  });

  const open = async () => {
    setOpened(true);
    setStage({ kind: "loading" });
    form.reset();
    codeForm.reset();
    const status = await getEmailChangeStatus();
    if (!status.success || !status.data) {
      setStage({ kind: "error", message: status.message });
      return;
    }
    setPasswordRequired(status.data.password_required);
    setStage(
      status.data.pending ? stageFor(status.data.pending) : { kind: "form" },
    );
  };

  const run = async <T,>(action: () => Promise<T>) => {
    setBusy(true);
    try {
      return await action();
    } finally {
      setBusy(false);
    }
  };

  const submitEmail = form.onSubmit(async (values) => {
    const result = await run(() =>
      startEmailChange({
        email: values.email,
        password: passwordRequired ? values.password : undefined,
      }),
    );
    if (!result.success || !result.data) {
      showNotif(result.message, true);
      return;
    }
    setStage(stageFor(result.data));
  });

  const submitCode = codeForm.onSubmit(async (values) => {
    const result = await run(() => verifyEmailChangeCode(values.code));
    if (!result.success || !result.data) {
      showNotif(result.message, true);
      if (RESTART_MESSAGES.includes(result.message)) {
        codeForm.reset();
        setStage({ kind: "form" });
      }
      return;
    }
    setStage(stageFor(result.data));
  });

  const cancel = async () => {
    const result = await run(() => cancelEmailChange());
    if (!result.success) {
      showNotif(result.message, true);
      return;
    }
    showNotif("Permintaan perubahan email dibatalkan.");
    form.reset();
    codeForm.reset();
    setStage({ kind: "form" });
  };

  const submitOnEnter = (submit: () => void) => (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div>
      <Text fw={600} size="sm">
        Email akun
      </Text>
      <Group gap="xs" wrap="wrap" align="center">
        <Text style={{ overflowWrap: "anywhere" }}>{currentEmail}</Text>
        <Button type="button" variant="light" size="compact-sm" onClick={open}>
          Ubah email
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Ubah email akun"
        centered
      >
        {stage.kind === "loading" && (
          <Group justify="center" py="lg">
            <Loader size="sm" aria-label="Memuat" />
          </Group>
        )}

        {stage.kind === "error" && (
          <Stack>
            <Alert color="red">{stage.message}</Alert>
            <Button type="button" variant="default" onClick={open}>
              Coba lagi
            </Button>
          </Stack>
        )}

        {stage.kind === "form" && (
          <Stack>
            <Text size="sm">
              Email sekarang: <b>{currentEmail}</b>
            </Text>
            <Alert color="yellow" title="Sebelum mengubah email">
              Setelah dikonfirmasi, masuk ke akun memakai email baru. Jika Anda
              biasa masuk dengan Google memakai email sekarang, masuk dengan
              Google memakai email lama akan membuat akun baru yang terpisah.
            </Alert>
            <TextInput
              {...form.getInputProps("email")}
              key={form.key("email")}
              label="Email baru"
              type="email"
              autoComplete="email"
              placeholder="nama@contoh.com"
              onKeyDown={submitOnEnter(() => submitEmail())}
              data-autofocus
              required
            />
            {passwordRequired ? (
              <PasswordInput
                {...form.getInputProps("password")}
                key={form.key("password")}
                label="Password sekarang"
                description="Untuk memastikan ini memang Anda."
                autoComplete="current-password"
                onKeyDown={submitOnEnter(() => submitEmail())}
                visibilityToggleButtonProps={{
                  "aria-label": "Tampilkan atau sembunyikan password",
                }}
                required
              />
            ) : (
              <Text size="sm" c="dimmed">
                Kami akan mengirim kode 6 angka ke {currentEmail} untuk
                memastikan ini memang Anda.
              </Text>
            )}
            <Text size="sm" c="dimmed">
              Email akun baru berubah setelah Anda membuka tautan konfirmasi
              yang kami kirim ke email baru.
            </Text>
            <Group justify="flex-end">
              <Button
                type="button"
                variant="default"
                onClick={() => setOpened(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                loading={busy}
                onClick={() => submitEmail()}
              >
                Lanjutkan
              </Button>
            </Group>
          </Stack>
        )}

        {stage.kind === "code" && (
          <Stack>
            <Text size="sm">
              Kami mengirim kode 6 angka ke <b>{currentEmail}</b>. Masukkan kode
              itu untuk melanjutkan perubahan ke <b>{stage.email}</b>. Kode
              berlaku 15 menit.
            </Text>
            <TextInput
              {...codeForm.getInputProps("code")}
              key={codeForm.key("code")}
              label="Kode"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              onKeyDown={submitOnEnter(() => submitCode())}
              data-autofocus
              required
            />
            <Group justify="space-between">
              <Button
                type="button"
                variant="subtle"
                color="red"
                disabled={busy}
                onClick={cancel}
              >
                Batalkan permintaan
              </Button>
              <Button type="button" loading={busy} onClick={() => submitCode()}>
                Verifikasi kode
              </Button>
            </Group>
          </Stack>
        )}

        {stage.kind === "sent" && (
          <Stack>
            <Alert color="blue" title="Cek email baru Anda">
              Kami mengirim tautan konfirmasi ke <b>{stage.email}</b>. Buka
              tautan itu dalam 60 menit untuk menyelesaikan perubahan. Sampai
              saat itu, email akun Anda tetap {currentEmail}.
            </Alert>
            <Group justify="space-between">
              <Button
                type="button"
                variant="subtle"
                color="red"
                disabled={busy}
                onClick={cancel}
              >
                Batalkan permintaan
              </Button>
              <Button type="button" onClick={() => setOpened(false)}>
                Tutup
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
