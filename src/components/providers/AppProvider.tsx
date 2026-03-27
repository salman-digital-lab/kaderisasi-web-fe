"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import theme from "@/lib/theme";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
