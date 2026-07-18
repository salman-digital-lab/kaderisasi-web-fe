"use client";

import {
  Card,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@mantine/core";
import classes from "./ClubDetailSkeleton.module.css";

export function ClubDetailSkeleton() {
  return (
    <Container size="lg" py={{ base: "md", md: "xl" }} aria-busy="true">
      <span className={classes.status} role="status">
        Memuat detail klub…
      </span>

      <Skeleton height={18} width={190} my={13} />

      <div className={classes.header}>
        <Skeleton className={classes.logo} radius="md" />
        <Stack gap="xs" className={classes.identity}>
          <Skeleton height={12} width="22%" />
          <Skeleton height={34} width="min(100%, 430px)" />
          <Skeleton height={16} width="min(92%, 560px)" />
        </Stack>
        <Stack gap="xs" className={classes.metadata}>
          <Skeleton height={14} width={160} />
          <Skeleton height={14} width={230} />
          <Skeleton height={14} width={210} />
        </Stack>
        <Card withBorder p="md" className={classes.action}>
          <Stack gap="sm">
            <Skeleton height={16} width="72%" />
            <Skeleton height={44} width="100%" radius="sm" />
          </Stack>
        </Card>
      </div>

      <Stack gap="xl" mt="xl">
        <section aria-hidden="true">
          <Skeleton height={28} width={190} mb="lg" />
          <Stack gap="sm" className={classes.prose}>
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="96%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="72%" />
          </Stack>
        </section>

        <section aria-hidden="true">
          <Skeleton height={28} width={130} mb="lg" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {Array.from({ length: 3 }, (_, index) => (
              <Card withBorder p="md" key={index}>
                <Group wrap="nowrap">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Skeleton height={18} width="75%" />
                    <Skeleton height={14} width="50%" />
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </section>
      </Stack>
    </Container>
  );
}

export default ClubDetailSkeleton;
