"use client";

import { Badge, Button, Paper, Text, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useId, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import classes from "./profile.module.css";

export type HistoryCardProps = {
  title: string;
  status: { label: string; color: string };
  /** Short facts shown after the status, e.g. date or method. */
  meta?: ReactNode[];
  /** Optional thumbnail column. */
  media?: ReactNode;
  /** Always-visible notice, e.g. a rejection reason. */
  notice?: ReactNode;
  actions?: ReactNode;
  /** Extra information revealed with "Lihat rincian". */
  details?: ReactNode;
};

/** Shared compact record used by every profile history tab. */
export default function HistoryCard({
  title,
  status,
  meta = [],
  media,
  notice,
  actions,
  details,
}: HistoryCardProps): ReactElement {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  return (
    <Paper
      component="article"
      withBorder
      p={{ base: "md", sm: "lg" }}
      className={classes.record}
      data-with-media={media ? true : undefined}
    >
      {media && <div className={classes.recordMedia}>{media}</div>}
      <div className={classes.recordBody}>
        <Title order={3} size="h4" className={classes.recordTitle}>
          {title}
        </Title>
        <div className={classes.recordMeta}>
          <Badge
            variant="light"
            tt="none"
            color={status.color}
            className={classes.badge}
          >
            {status.label}
          </Badge>
          {meta.map((item, index) => (
            <Text key={index} size="sm" c="dimmed" component="span">
              {item}
            </Text>
          ))}
        </div>
        {notice}
        {(actions || details) && (
          <div className={classes.actions}>
            {actions}
            {details && (
              <Button
                variant="subtle"
                aria-expanded={open}
                aria-controls={detailsId}
                rightSection={
                  <IconChevronDown
                    size={16}
                    aria-hidden
                    className={classes.chevron}
                    data-open={open || undefined}
                  />
                }
                onClick={() => setOpen((value) => !value)}
              >
                {open ? "Sembunyikan rincian" : "Lihat rincian"}
              </Button>
            )}
          </div>
        )}
        {details && (
          <div id={detailsId} hidden={!open} className={classes.recordDetails}>
            {details}
          </div>
        )}
      </div>
    </Paper>
  );
}
