"use client";

import Link from "next/link";
import { Button } from "@mantine/core";
import { IconCertificate } from "@tabler/icons-react";
import type { CertificateCta } from "../utils/certificateData";

export default function CertificateCtaButton({
  cta,
  marginTop,
}: {
  cta: CertificateCta;
  marginTop?: string | number;
}) {
  return (
    <Button
      color={cta.color}
      component={Link}
      fullWidth
      href={cta.href}
      leftSection={<IconCertificate aria-hidden size={18} />}
      mt={marginTop}
      size="md"
    >
      {cta.label}
    </Button>
  );
}
