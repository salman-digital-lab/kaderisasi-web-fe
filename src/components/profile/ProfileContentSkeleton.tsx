"use client";

import { SimpleGrid, Box } from "@mantine/core";
import { ProfileCardSkeleton, ProfileTabContentSkeleton } from "@/components/skeletons";

import classes from "@/app/(common)/profile/index.module.css";

export function ProfileContentSkeleton() {
  return (
    <SimpleGrid
      cols={{ base: 1, md: 3 }}
      spacing="xl"
      className={classes.content}
    >
      {/* Profile Card Skeleton */}
      <Box className={classes.profileSection}>
        <ProfileCardSkeleton />
      </Box>

      {/* Content Section Skeleton */}
      <Box className={classes.contentSection}>
        <ProfileTabContentSkeleton />
      </Box>
    </SimpleGrid>
  );
}

export default ProfileContentSkeleton;

