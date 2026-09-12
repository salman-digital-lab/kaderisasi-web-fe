"use client";
import { Badge, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useId, useState } from "react";
import type { ReactElement } from "react";
import type { RuangCurhatData } from "@/types/model/ruangcurhat";
import { PROBLEM_OWNER_ENUM } from "@/types/constants/ruangcurhat";
import {
  PROBLEM_STATUS_RENDER,
  PROBLEM_STATUS_RENDER_COLOR,
} from "@/constants/render/ruangcurhat";
import classes from "@/features/profile/profile.module.css";

export default function RuangCurhatCard({
  data,
}: {
  data: RuangCurhatData;
}): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const longDescription = data.problem_description.length > 180;
  return (
    <Paper
      component="article"
      withBorder
      p={{ base: "md", sm: "lg" }}
      className={classes.record}
    >
      <Stack gap="md">
        <div className={classes.sectionHeader}>
          <div>
            <Title order={3} size="h4">
              {data.problem_category}
            </Title>
            <Text c="dimmed" mt={4}>
              Diajukan{" "}
              {new Date(data.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </div>
          <Badge
            color={PROBLEM_STATUS_RENDER_COLOR[data.status]}
            variant="light"
            tt="none"
            className={classes.badge}
          >
            {PROBLEM_STATUS_RENDER[data.status]}
          </Badge>
        </div>
        <div className={classes.metadata}>
          <Text>
            <Text span c="dimmed">
              Metode:{" "}
            </Text>
            {data.handling_technic}
          </Text>
          <Text>
            <Text span c="dimmed">
              Untuk:{" "}
            </Text>
            {data.problem_ownership === PROBLEM_OWNER_ENUM.TEMAN
              ? data.owner_name || "Teman"
              : "Diri sendiri"}
          </Text>
        </div>
        <div>
          <Text fw={600} mb={4}>
            Deskripsi
          </Text>
          <Text id={descriptionId} className={classes.description}>
            {longDescription && !expanded
              ? `${data.problem_description.slice(0, 180)}…`
              : data.problem_description}
          </Text>
          {longDescription && (
            <Button
              variant="subtle"
              px={0}
              mt={4}
              aria-expanded={expanded}
              aria-controls={descriptionId}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Ringkas deskripsi" : "Baca selengkapnya"}
            </Button>
          )}
        </div>
        <Group gap="xs" align="start">
          <Text fw={600}>Konselor:</Text>
          <div>
            <Text>
              {data.adminUser?.display_name ||
                "Informasi konselor belum tersedia."}
            </Text>
            {data.adminUser?.email && (
              <Text c="dimmed" className={classes.description}>
                {data.adminUser.email}
              </Text>
            )}
          </div>
        </Group>
      </Stack>
    </Paper>
  );
}
