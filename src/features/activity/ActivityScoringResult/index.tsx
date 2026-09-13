import { Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { PublishedScoringResult } from "@/types/api/scoring";

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
    <Card withBorder radius="md" p="lg" mt="md">
      <Stack gap="md">
        <Title order={2} size="h4">
          Hasil penilaian
        </Title>
        <Text size="sm" c="dimmed">
          Diterbitkan{" "}
          {new Date(score.published_at).toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        {score.rubric.groups.map((group) => (
          <section key={group.id} aria-label={group.name}>
            <Title order={3} size="h5" mb="xs">
              {group.name}
            </Title>
            <Table
              style={{ tableLayout: "fixed", overflowWrap: "anywhere" }}
              verticalSpacing="sm"
              data={{
                head: [
                  "Aspek",
                  "Nilai",
                  "Skala 100",
                  ...(hasGrades ? ["Indeks"] : []),
                ],
                body: group.criteria.map((criterion) => {
                  const result = results.get(criterion.id);
                  return [
                    criterion.name,
                    `${number(result?.score ?? null)} / ${number(criterion.maximum)}`,
                    number(result?.normalized ?? null),
                    ...(hasGrades ? [result?.grade ?? "Tidak ada"] : []),
                  ];
                }),
              }}
            />
          </section>
        ))}
        <Group justify="space-between">
          <Text fw={700}>Total (rata-rata berbobot)</Text>
          <Text fw={700}>
            {number(score.result.total)}
            {score.result.grade ? ` · ${score.result.grade}` : ""}
          </Text>
        </Group>
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
