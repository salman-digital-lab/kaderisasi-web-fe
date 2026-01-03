"use client";

import {
  Card,
  Skeleton,
  Stack,
  SimpleGrid,
  Box,
  Divider,
} from "@mantine/core";

export function ProfileCardSkeleton() {
  return (
    <Card radius="lg" withBorder p="xl">
      <Stack align="center" gap="md">
        {/* Avatar */}
        <Skeleton height={120} width={120} circle />

        {/* Name */}
        <Box ta="center" w="100%">
          <Skeleton height={24} width="60%" mx="auto" mb="xs" />
        </Box>

        {/* Badges */}
        <Divider w="100%" />
        <Box w="100%">
          <Skeleton height={14} width={60} mx="auto" mb="xs" />
          <Stack gap="xs" align="center">
            <Skeleton height={22} width={80} radius="xl" />
          </Stack>
        </Box>

        <Divider w="100%" />

        {/* Quick Stats */}
        <SimpleGrid cols={3} w="100%" spacing="xs">
          {[1, 2, 3].map((i) => (
            <Box key={i} ta="center">
              <Skeleton height={20} width={20} mx="auto" mb={4} />
              <Skeleton height={12} width="80%" mx="auto" mb={4} />
              <Skeleton height={14} width={30} mx="auto" />
            </Box>
          ))}
        </SimpleGrid>

        <Divider w="100%" />

        {/* Logout Button */}
        <Skeleton height={36} width="100%" radius="md" />
      </Stack>
    </Card>
  );
}

export default ProfileCardSkeleton;

