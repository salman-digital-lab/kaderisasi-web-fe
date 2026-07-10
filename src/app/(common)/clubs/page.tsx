import { Suspense } from "react";
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import ClubsListContent from "@/components/clubs/ClubsListContent";
import ClubsListSkeleton from "@/components/clubs/ClubsListSkeleton";

export const metadata = {
  title: "Club",
  description: "Daftar UKM dan AVISMAN di lingkungan Kaderisasi Salman.",
};

type ClubsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const normalizeParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getTypeHref = (search: string, type?: string): string => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (type) params.set("type", type);
  const query = params.toString();
  return query ? `/clubs?${query}` : "/clubs";
};

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const params = await searchParams;
  const search = normalizeParam(params.search);
  const type = normalizeParam(params.type);
  const clubType = type === "UKM" || type === "AVISMAN" ? type : undefined;

  return (
    <main>
      <Container size="lg" py={{ base: "lg", md: "xl" }}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={1}>Club</Title>
            <Text c="dimmed" maw={720}>
              Jelajahi UKM dan AVISMAN yang tersedia di Kaderisasi Salman.
            </Text>
          </Stack>

          <Paper withBorder p="md" radius="md">
            <form action="/clubs">
              <Group align="end" gap="md">
                <TextInput
                  name="search"
                  label="Cari club"
                  placeholder="Nama club"
                  defaultValue={search}
                  leftSection={<IconSearch size={16} />}
                  style={{ flex: 1, minWidth: 220 }}
                />
                <input type="hidden" name="type" value={clubType || ""} />
                <Button type="submit">Cari</Button>
              </Group>
            </form>
            <Group mt="md" gap="xs">
              <Link
                href={getTypeHref(search)}
                style={{ textDecoration: "none" }}
              >
                <Button variant={!clubType ? "filled" : "light"} size="xs">
                  Semua
                </Button>
              </Link>
              <Link
                href={getTypeHref(search, "UKM")}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant={clubType === "UKM" ? "filled" : "light"}
                  size="xs"
                >
                  UKM
                </Button>
              </Link>
              <Link
                href={getTypeHref(search, "AVISMAN")}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant={clubType === "AVISMAN" ? "filled" : "light"}
                  size="xs"
                >
                  AVISMAN
                </Button>
              </Link>
            </Group>
          </Paper>

          <Suspense
            key={`${search}-${clubType || "ALL"}`}
            fallback={<ClubsListSkeleton />}
          >
            <ClubsListContent search={search} clubType={clubType} />
          </Suspense>
        </Stack>
      </Container>
    </main>
  );
}
