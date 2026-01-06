"use client";

import {
  Group,
  Divider,
  Drawer,
  ScrollArea,
  rem,
  Avatar,
  Text,
  Stack,
  Button,
  Box,
  Card,
  UnstyledButton,
  ThemeIcon,
} from "@mantine/core";

import {
  IconLogout,
  IconSettings,
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconMessageCircle,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logout from "../../../../functions/server/logout";

type NavDrawer = {
  drawerOpened: boolean;
  closeDrawer: () => void;
  session: { name?: string; session?: string; profilePicture?: string };
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/", icon: IconHome },
  { label: "Kegiatan", href: "/activity", icon: IconCalendarEvent },
  { label: "Unit Kegiatan & Kepanitiaan", href: "/clubs", icon: IconUsers },
  { label: "Ruang Curhat", href: "/consultation", icon: IconMessageCircle },
  { label: "Leaderboard", href: "/leaderboard", icon: IconTrophy },
];

export default function NavDrawer({
  drawerOpened,
  closeDrawer,
  session,
}: NavDrawer) {
  const pathname = usePathname();

  return (
    <Drawer
      opened={drawerOpened}
      onClose={closeDrawer}
      size="280px"
      padding="md"
      position="right"
      title={
        <Text fw={600} size="lg">
          Menu
        </Text>
      }
      hiddenFrom="md"
      zIndex={1000000}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        {/* User Profile Section */}
        {session.session ? (
          <Box px="md" py="lg">
            <Card
              radius="lg"
              withBorder
              p="md"
              style={{
                background:
                  "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
              }}
            >
              <Stack gap="md">
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    radius="xl"
                    size={48}
                    src={
                      session.profilePicture && session.profilePicture !== ""
                        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${session.profilePicture}`
                        : undefined
                    }
                  />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={600} lineClamp={1}>
                      {session.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Aktivis Salman
                    </Text>
                  </Box>
                </Group>
                <Group gap="xs" grow>
                  <Link href="/profile" style={{ textDecoration: "none" }}>
                    <Button
                      variant="light"
                      color="blue"
                      leftSection={<IconSettings size={16} />}
                      radius="md"
                      size="sm"
                      fullWidth
                      onClick={closeDrawer}
                    >
                      Profil
                    </Button>
                  </Link>
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    radius="md"
                    size="sm"
                    onClick={() => {
                      logout();
                      closeDrawer();
                    }}
                  >
                    Keluar
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Box>
        ) : (
          <Box px="md" py="lg">
            <Stack gap="xs">
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="filled"
                  radius="md"
                  fullWidth
                  onClick={closeDrawer}
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <Button
                  variant="default"
                  radius="md"
                  fullWidth
                  onClick={closeDrawer}
                >
                  Daftar
                </Button>
              </Link>
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Navigation Items */}
        <Box py="sm">
          <Stack gap={4}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                >
                  <UnstyledButton
                    onClick={closeDrawer}
                    px="md"
                    py="sm"
                    style={(theme) => ({
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      borderRadius: theme.radius.md,
                      transition: "all 150ms ease",
                      backgroundColor: isActive
                        ? theme.colors.blue[0]
                        : "transparent",
                      color: isActive
                        ? theme.colors.blue[7]
                        : theme.colors.gray[7],
                      "&:hover": {
                        backgroundColor: isActive
                          ? theme.colors.blue[1]
                          : theme.colors.gray[0],
                      },
                    })}
                  >
                    <ThemeIcon
                      variant={isActive ? "light" : "transparent"}
                      color={isActive ? "blue" : "gray"}
                      size="md"
                      radius="md"
                      mr="sm"
                    >
                      <Icon style={{ width: rem(18), height: rem(18) }} />
                    </ThemeIcon>
                    <Text
                      size="sm"
                      fw={isActive ? 600 : 500}
                      style={{ flex: 1 }}
                    >
                      {item.label}
                    </Text>
                  </UnstyledButton>
                </Link>
              );
            })}
          </Stack>
        </Box>
      </ScrollArea>
    </Drawer>
  );
}
