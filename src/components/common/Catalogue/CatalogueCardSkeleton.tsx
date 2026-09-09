import { Card, Group, Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";
import classes from "./Catalogue.module.css";

export default function CatalogueCardSkeleton(): ReactElement {
  return (
    <Card withBorder radius="md" p={0} className={classes.card} aria-hidden>
      <Skeleton height={180} radius={0} />
      <div className={classes.cardTitle}>
        <Skeleton height={20} width="82%" />
      </div>
      {[0, 1].map((section) => (
        <Stack key={section} gap="xs" className={classes.cardSection}>
          <Skeleton height={14} width="55%" />
          <Group gap="xs">
            <Skeleton height={22} width={100} radius="xl" />
          </Group>
        </Stack>
      ))}
      <div className={classes.cardAction}>
        <Skeleton height={44} radius="md" />
      </div>
    </Card>
  );
}
