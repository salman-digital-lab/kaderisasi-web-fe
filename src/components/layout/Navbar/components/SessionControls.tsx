import Link from "next/link";
import type { ReactElement } from "react";
import {
  Group,
  rem,
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  MenuDivider,
  Text,
  Button,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { verifySession } from "@/functions/server/session";
import ProfilePictureNav from "@/features/profile/ProfilePictureNav";
import ClientNavbar from "./ClientNavbar";
import LogoutButton from "./LogoutButton";
import classes from "../index.module.css";

export default async function SessionControls(): Promise<ReactElement> {
  const sessionData = await verifySession();
  return (
    <>
      {sessionData.session ? (
        <Group visibleFrom="md" className={classes.link}>
          <Menu shadow="md" width={200}>
            <MenuTarget>
              <Group>
                <ProfilePictureNav
                  token={sessionData.session || ""}
                  src={sessionData.profilePicture}
                />
                <Text size="md">{sessionData.name}</Text>
              </Group>
            </MenuTarget>

            <MenuDropdown>
              <Link href="/profile" style={{ textDecoration: "none" }}>
                <MenuItem
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Profile
                </MenuItem>
              </Link>

              <MenuDivider />

              <LogoutButton />
            </MenuDropdown>
          </Menu>
        </Group>
      ) : (
        <Group visibleFrom="md">
          <Link href="/login" style={{ textDecoration: "none" }}>
            <Button variant="default">Masuk</Button>
          </Link>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <Button>Daftar</Button>
          </Link>
        </Group>
      )}
      <ClientNavbar session={sessionData} />
    </>
  );
}
