import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import type { ReactElement, ReactNode } from "react";
import classes from "./DetailLayout.module.css";

export default function DetailBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactElement {
  return (
    <Link href={href} className={classes.backLink}>
      <IconArrowLeft size={18} aria-hidden />
      {children}
    </Link>
  );
}
