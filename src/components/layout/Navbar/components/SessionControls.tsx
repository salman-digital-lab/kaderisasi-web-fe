import type { ReactElement } from "react";
import { Group } from "@mantine/core";
import { verifySession } from "@/functions/server/session";
import LinkButton from "@/components/common/LinkButton";
import ClientNavbar from "./ClientNavbar";
import AccountMenu from "./AccountMenu";

export default async function SessionControls(): Promise<ReactElement> {
  const sessionData = await verifySession();
  return (
    <>
      <Group visibleFrom="md" gap="sm" wrap="nowrap">
        {sessionData.session ? (
          <AccountMenu
            name={sessionData.name}
            profilePicture={sessionData.profilePicture}
          />
        ) : (
          <>
            <LinkButton href="/login" variant="default">
              Masuk
            </LinkButton>
            <LinkButton href="/register">Daftar</LinkButton>
          </>
        )}
      </Group>
      <ClientNavbar session={sessionData} />
    </>
  );
}
