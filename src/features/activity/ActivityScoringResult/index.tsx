import { Card, Group, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { PublishedScoringResult } from "@/types/api/scoring";
import classes from "./index.module.css";

const number = (value: number | null): string =>
  value === null
    ? "Belum dinilai"
    : value.toLocaleString("id-ID", { maximumFractionDigits: 2 });

export default function ActivityScoringResult({
  score,
}: {
  score: PublishedScoringResult;
}): ReactElement {
  const results = new Map(
    score.result.criteria.map((criterion) => [
      criterion.criterion_id,
      criterion,
    ]),
  );
  const hasGrades = score.rubric.grades.length > 0;
  return (
    <Card
      withBorder
      radius="md"
      p={{ base: "md", sm: "lg" }}
      mt="md"
      className={classes.details}
    >
      <Stack gap="md">
        <Title order={2} size="h4">
          Hasil penilaian
        </Title>
        <Text size="sm" c="dimmed">
          Nilai terbit{" "}
          {new Date(score.published_at).toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Group justify="space-between" className={classes.total}>
          <div>
            <Text fw={700}>Nilai akhir</Text>
            <Text size="sm">Rata-rata berbobot · skala 0–100</Text>
          </div>
          <Text fw={700} size="xl">
            {number(score.result.total)} / 100
            {score.result.grade ? ` · ${score.result.grade}` : ""}
          </Text>
        </Group>
        {score.rubric.groups.map((group) => (
          <section key={group.id} aria-label={group.name}>
            <Title order={3} size="h5" mb="xs">
              {group.name}
            </Title>
            <ul className={classes.criteria}>
              {group.criteria.map((criterion) => {
                const result = results.get(criterion.id);
                return (
                  <li key={criterion.id} className={classes.criterion}>
                    <Text fw={600}>{criterion.name}</Text>
                    <dl className={classes.metrics}>
                      <div>
                        <dt>Nilai / maks.</dt>
                        <dd>
                          {number(result?.score ?? null)} /{" "}
                          {number(criterion.maximum)}
                        </dd>
                      </div>
                      <div>
                        <dt>Skala 100</dt>
                        <dd>{number(result?.normalized ?? null)}</dd>
                      </div>
                      <div>
                        <dt>Bobot</dt>
                        <dd>{number(criterion.weight)}</dd>
                      </div>
                      {hasGrades && (
                        <div>
                          <dt>Indeks</dt>
                          <dd>{result?.grade ?? "Tidak ada"}</dd>
                        </div>
                      )}
                    </dl>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {score.note && (
          <div>
            <Text fw={600}>Catatan peserta</Text>
            <Text style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {score.note}
            </Text>
          </div>
        )}
        {score.rubric.note && (
          <div>
            <Text fw={600}>Catatan kegiatan</Text>
            <Text style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {score.rubric.note}
            </Text>
          </div>
        )}
      </Stack>
    </Card>
  );
}
