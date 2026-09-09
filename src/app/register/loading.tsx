import { Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function Loading(): ReactElement {
  return (
    <AuthLayout title="Buat akun" description="Menyiapkan formulir…">
      <Stack role="status" aria-label="Memuat formulir">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={72} />
        ))}
        <Skeleton height={44} />
      </Stack>
    </AuthLayout>
  );
}
