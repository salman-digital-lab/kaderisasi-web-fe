"use client";

import Link from "next/link";
import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import {
  IconChevronDown,
  IconSettings,
  IconActivity,
} from "@tabler/icons-react";
import type { ReactElement } from "react";
import ProfilePictureNav from "@/features/profile/ProfilePictureNav";
import LogoutButton from "./LogoutButton";
import classes from "../index.module.css";

export default function AccountMenu({
  name,
  profilePicture,
}: {
  name?: string;
  profilePicture?: string;
}): ReactElement {
  return (
    <Menu width={220}>
      <Menu.Target>
        <UnstyledButton className={classes.account} aria-label="Menu akun">
          <Group gap="sm" wrap="nowrap">
            <ProfilePictureNav src={profilePicture} />
            <Text component="span" truncate maw={160}>
              {name || "Akun saya"}
            </Text>
            <IconChevronDown size={16} aria-hidden />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href="/profile"
          leftSection={<IconSettings size={18} aria-hidden />}
        >
          Profil Saya
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/status"
          leftSection={<IconActivity size={18} aria-hidden />}
        >
          Kegiatan Saya
        </Menu.Item>
        <Menu.Divider />
        <LogoutButton />
      </Menu.Dropdown>
    </Menu>
  );
}
