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
  UnstyledButton,
  ThemeIcon,
} from "@mantine/core";

import {
  IconLogout,
  IconUser,
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconMessageCircle,
  IconTrophy,
  IconActivity,
  IconChevronRight,
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

// User-specific menu items (only shown when logged in)
const userMenuItems: NavItem[] = [
  { label: "Kegiatan Saya", href: "/status", icon: IconActivity },
  { label: "Profil Saya", href: "/profile", icon: IconUser },
];

// Reusable menu item component
function MenuItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <UnstyledButton
        onClick={onClick}
        px="md"
        py="xs"
        style={(theme) => ({
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: theme.radius.md,
          transition: "all 150ms ease",
          backgroundColor: isActive ? theme.colors.blue[0] : "transparent",
          color: isActive ? theme.colors.blue[7] : theme.colors.gray[7],
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
          size="sm"
          radius="md"
          mr="sm"
        >
          <Icon style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
        <Text size="sm" fw={isActive ? 600 : 400} style={{ flex: 1 }}>
          {item.label}
        </Text>
        <IconChevronRight
          size={14}
          style={{ opacity: 0.4 }}
          color="currentColor"
        />
      </UnstyledButton>
    </Link>
  );
}

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
      size="300px"
      padding={0}
      position="right"
      hiddenFrom="md"
      zIndex={1000000}
      withCloseButton={false}
    >
      <Stack h="100vh" gap={0}>
        {/* Header */}
        <Box
          px="md"
          py="sm"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          {session.session ? (
            <Group gap="sm" wrap="nowrap">
              <Avatar
                radius="xl"
                size={40}
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
          ) : (
            <Text fw={600} size="md">
              Menu
            </Text>
          )}
        </Box>

        {/* Scrollable Content */}
        <ScrollArea style={{ flex: 1 }}>
          {/* User Menu Section - Only for logged in users */}
          {session.session && (
            <>
              <Box px="sm" py="sm">
                <Text size="xs" c="dimmed" fw={600} px="sm" mb="xs">
                  AKUN SAYA
                </Text>
                <Stack gap={2}>
                  {userMenuItems.map((item) => (
                    <MenuItem
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      onClick={closeDrawer}
                    />
                  ))}
                </Stack>
              </Box>
              <Divider />
            </>
          )}

          {/* Navigation Section */}
          <Box px="sm" py="sm">
            <Text size="xs" c="dimmed" fw={600} px="sm" mb="xs">
              JELAJAHI
            </Text>
            <Stack gap={2}>
              {navItems.map((item) => (
                <MenuItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={closeDrawer}
                />
              ))}
            </Stack>
          </Box>
        </ScrollArea>

        {/* Footer */}
        <Box
          px="md"
          py="md"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          {session.session ? (
            <Button
              variant="light"
              color="red"
              leftSection={<IconLogout size={16} />}
              radius="md"
              fullWidth
              onClick={() => {
                logout();
                closeDrawer();
              }}
            >
              Keluar
            </Button>
          ) : (
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
          )}
        </Box>
      </Stack>
    </Drawer>
  );
}
