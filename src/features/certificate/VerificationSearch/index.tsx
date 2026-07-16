"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { certificateCodeInputSchema } from "../schemas/certificate";
import { getVerificationPath } from "../utils/certificateData";

export default function VerificationSearch() {
  const router = useRouter();
  const [certificateCode, setCertificateCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = certificateCodeInputSchema.safeParse(certificateCode);

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? "Kode sertifikat tidak valid.",
      );
      return;
    }

    setError(null);
    router.push(getVerificationPath(result.data));
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          autoCapitalize="characters"
          autoComplete="off"
          description="Kode tercantum pada sertifikat atau tautan resmi."
          error={error}
          label="Kode sertifikat"
          leftSection={<IconSearch aria-hidden size={18} />}
          maxLength={96}
          name="certificateCode"
          onChange={(event) => {
            setCertificateCode(event.currentTarget.value);
            if (error) setError(null);
          }}
          placeholder="Contoh: CERT-2026-ABC123"
          required
          value={certificateCode}
        />
        <Button size="md" type="submit">
          Periksa sertifikat
        </Button>
      </Stack>
    </form>
  );
}
