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
    <Container size="md" py={{ base: "md", md: "xl" }} aria-busy="true">
      <span className={classes.status} role="status">
        Memuat detail klub…
      </span>

      <Stack gap="md">
        <Skeleton height={18} width={190} my={13} />

        <div className={classes.header}>
          <Card withBorder radius="md" p="lg" className={classes.identityCard}>
            <Group
              align="flex-start"
              wrap="nowrap"
              gap="lg"
              className={classes.identityHeader}
            >
              <Skeleton className={classes.logo} radius="md" />
              <Stack gap="xs" className={classes.identity}>
                <Group gap="xs">
                  <Skeleton height={22} width={54} radius="xl" />
                  <Skeleton height={22} width={132} radius="xl" />
                </Group>
                <Skeleton height={34} width="min(100%, 430px)" />
                <Skeleton height={16} width="min(92%, 520px)" />
              </Stack>
            </Group>
            <Group gap="xs" mt="lg">
              <Skeleton height={22} width={176} radius="xl" />
              <Skeleton height={22} width={218} radius="xl" />
            </Group>
          </Card>

          <Card withBorder radius="md" p="lg" className={classes.actionCard}>
            <Stack gap="md">
              <Skeleton height={18} width="72%" mx="auto" />
              <Skeleton height={44} width="100%" radius="sm" />
            </Stack>
          </Card>
        </div>

        <Stack gap="md">
          <Card withBorder radius="md" p="lg" aria-hidden="true">
            <Skeleton height={26} width={210} mb="lg" />
            <Stack gap="sm" className={classes.prose}>
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="96%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="72%" />
            </Stack>
          </Card>

          <Card withBorder radius="md" p="lg" aria-hidden="true">
            <Skeleton height={26} width={130} mb="lg" />
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {Array.from({ length: 3 }, (_, index) => (
                <Card withBorder p="md" radius="md" key={index}>
                  <Stack gap="xs">
                    <Skeleton height={18} width="75%" />
                    <Skeleton height={14} width="50%" />
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ClubDetailSkeleton;
