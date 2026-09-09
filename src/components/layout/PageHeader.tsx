import { Text, Title } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import classes from "./PageLayout.module.css";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps): ReactElement {
  return (
    <header className={classes.pageHeader}>
      {children}
      <Title order={1}>{title}</Title>
      {description && (
        <Text c="dimmed" className={classes.description}>
          {description}
        </Text>
      )}
    </header>
  );
}
