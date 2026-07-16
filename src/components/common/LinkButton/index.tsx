"use client";

import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

type AnchorProps = Omit<
  ComponentPropsWithoutRef<"a">,
  keyof ButtonProps | "href"
>;

type LinkButtonProps = ButtonProps &
  AnchorProps & {
    href: string;
  };

export default function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button component={Link} href={href} {...props} />;
}
