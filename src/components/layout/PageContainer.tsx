import { Container } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import classes from "./PageLayout.module.css";

type PageContainerProps = {
  children: ReactNode;
  size?: "lg" | "md" | "sm";
  className?: string;
};

/** Wide lists, readable detail pages, and focused forms share one spacing scale. */
export default function PageContainer({
  children,
  size = "lg",
  className,
}: PageContainerProps): ReactElement {
  return (
    <Container
      size={size}
      className={[classes.page, className].filter(Boolean).join(" ")}
    >
      {children}
    </Container>
  );
}
