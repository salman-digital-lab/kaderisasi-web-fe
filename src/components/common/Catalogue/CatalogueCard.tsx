import { Card, Group, Text } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import LinkButton from "@/components/common/LinkButton";
import classes from "./Catalogue.module.css";

type CatalogueCardProps = {
  title: string;
  href: string;
  linkLabel: string;
  media?: ReactNode;
  description?: string;
  actionLabel?: string;
  children: ReactNode;
};

export default function CatalogueCard({
  title,
  href,
  linkLabel,
  media,
  description,
  actionLabel = "Lihat Selengkapnya",
  children,
}: CatalogueCardProps): ReactElement {
  return (
    <Card
      component="article"
      withBorder
      radius="md"
      p={0}
      className={classes.card}
    >
      {media && <div className={classes.media}>{media}</div>}
      <div className={classes.cardTitle}>
        <Text component="h2" m={0} fw={600} fz="md">
          {title}
        </Text>
        {description && (
          <Text c="dimmed" size="sm" mt="xs" lineClamp={3}>
            {description}
          </Text>
        )}
      </div>
      {children}
      <div className={classes.cardAction}>
        <LinkButton href={href} aria-label={linkLabel} fullWidth>
          {actionLabel}
        </LinkButton>
      </div>
    </Card>
  );
}

export function CatalogueCardSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className={classes.cardSection}>
      <Text className={classes.label} c="dimmed">
        {label}
      </Text>
      <Group gap={7} mt={5}>
        {children}
      </Group>
    </div>
  );
}
