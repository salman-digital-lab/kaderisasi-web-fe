"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import { getAuthRedirect } from "@/features/auth/redirect";

export default function AuthLinks(): ReactElement {
  const destination = encodeURIComponent(getAuthRedirect(usePathname()));
  return (
    <>
      <LinkButton href={`/login?redirect=${destination}`} variant="default">
        Masuk
      </LinkButton>
      <LinkButton href={`/register?redirect=${destination}`}>Daftar</LinkButton>
    </>
  );
}
