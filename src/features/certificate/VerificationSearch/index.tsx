"use client";

import { Button, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { getVerificationPath } from "../utils/certificateData";
import { parseVerificationInput } from "../utils/verificationInput";

export default function VerificationSearch({
  appUrl,
}: {
  appUrl?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [certificateCode, setCertificateCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const code = parseVerificationInput(certificateCode, appUrl);
    if (!code) {
      setError("Masukkan kode atau tautan sertifikat dari situs ini.");
      return;
    }
    setError(null);
    startTransition(() => router.push(getVerificationPath(code)));
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          autoCapitalize="characters"
          autoComplete="off"
          description="Kode tercantum pada sertifikat atau tautan resmi."
          error={error}
          label="Kode atau tautan sertifikat"
          leftSection={<IconSearch aria-hidden size={18} />}
          maxLength={2048}
          name="certificateCode"
          onChange={(event) => {
            setCertificateCode(event.currentTarget.value);
            if (error) setError(null);
          }}
          placeholder="Contoh: CERT-2026-ABC123"
          required
          value={certificateCode}
        />
        <Button size="md" type="submit" loading={pending}>
          Periksa sertifikat
        </Button>
      </Stack>
    </form>
  );
}
