import { Paper, Skeleton, Stack, Text } from "@mantine/core";
import type { ReactElement } from "react";
import classes from "./status.module.css";

export default function StatusSkeleton(): ReactElement {
  return (
    <Stack gap="lg" aria-busy="true" aria-label="Memuat pendaftaran">
      <div className={classes.toolbar} aria-hidden="true">
        {[0, 1].map((item) => (
          <Stack gap={6} key={item}>
            <Skeleton height={24} width={130} />
            <Skeleton height={44} />
          </Stack>
        ))}
      </div>
      <Text role="status">Memuat status kegiatan...</Text>
      {[0, 1, 2].map((item) => (
        <Paper
          key={item}
          withBorder
          p={{ base: "md", sm: "lg" }}
          aria-hidden="true"
        >
          <Stack gap="sm">
            <Skeleton height={52} />
            <Skeleton height={28} width={120} />
            <Skeleton height={22} width="60%" />
            <Skeleton height={44} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
