"use client";

import Link from "next/link";
import { Button, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { getCertificatePath } from "../utils/certificateData";

export default function VerificationResultActions({
  certificateCode,
  showCertificate,
}: {
  certificateCode: string;
  showCertificate: boolean;
}) {
  return (
    <Group grow preventGrowOverflow={false} wrap="wrap">
      <Button
        component={Link}
        href="/certificate/verify"
        leftSection={<IconSearch aria-hidden size={18} />}
        size="md"
        variant="default"
      >
        Periksa kode lain
      </Button>
      {showCertificate && (
        <Button
          component={Link}
          href={getCertificatePath(certificateCode)}
          size="md"
        >
          Lihat sertifikat
        </Button>
      )}
    </Group>
  );
}
