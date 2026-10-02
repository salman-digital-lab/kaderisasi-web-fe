import Link from "next/link";
import { Button, Text, Title, VisuallyHidden } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { ReactElement, ReactNode } from "react";
import classes from "./profile.module.css";

/**
 * Compact header shared by the profile history tabs. The tab already names the
 * section, so the heading is kept for screen readers only.
 */
export default function HistoryPanelHeader({
  title,
  summary,
  action,
}: {
  title: string;
  summary: ReactNode;
  action: { href: string; label: string };
}): ReactElement {
  return (
    <div className={classes.panelToolbar}>
      <VisuallyHidden>
        <Title order={2}>{title}</Title>
      </VisuallyHidden>
      <Text c="dimmed">{summary}</Text>
      <Button
        component={Link}
        href={action.href}
        variant="light"
        leftSection={<IconPlus size={16} aria-hidden />}
      >
        {action.label}
      </Button>
    </div>
  );
}
