"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@mantine/core";
import type { ReactElement } from "react";
import Image from "next/image";
import googleLogo from "@/assets/google-logo.png";

export default function GoogleLoginButton(): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="default"
      fullWidth
      loading={pending}
      leftSection={<Image src={googleLogo} width={20} height={20} alt="" />}
    >
      Lanjutkan dengan Google
    </Button>
  );
}
