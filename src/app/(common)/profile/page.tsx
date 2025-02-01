import {
  Text,
  Button,
  Paper,
  Container,
  Flex,
  Group,
  Badge,
} from "@mantine/core";

import { getProfile, getProvinces } from "../../../services/profile";

import ErrorWrapper from "../../../components/layout/Error";
import { verifySession } from "../../../functions/server/session";
import { USER_LEVEL_RENDER } from "../../../constants/render/activity";
import { getActivitiesRegistration } from "../../../services/activity";
import { ProfileTab } from "../../../features/profile/ProfileTab";
import { ProfilePicture } from "../../../features/profile/ProfilePicture";

import classes from "./index.module.css";
import { getRuangCurhat } from "../../../services/ruangcurhat";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";
import { Activity, Registrant } from "@/types/model/activity";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profil",
};

export default async function Page() {
  let provinceData: Province[] | undefined;
  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  let activitiesRegistration:
    | ({ activity: Activity } & Registrant)[]
    | undefined;

  let ruangCurhatData: RuangCurhatData[] | undefined;

  const sessionData = await verifySession();

  try {
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");
    activitiesRegistration = await getActivitiesRegistration(
      sessionData.session || "",
    );
    ruangCurhatData = await getRuangCurhat(sessionData.session || "");
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
  }

  return (
    <main className={classes.container}>
      <Container size="lg">
        <Flex gap="xl" className={classes.content}>
          <Paper radius="md" withBorder p="lg" miw="20rem" h="fit-content">
            <ProfilePicture src={profileData?.profile.picture} token={sessionData.session || ""} />
            <Text ta="center" fz="lg" fw={500} mt="md">
              {profileData?.profile.name}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {profileData &&
                USER_LEVEL_RENDER[
                  profileData.profile.level || USER_LEVEL_ENUM.JAMAAH
                ]}
            </Text>
            <Group gap="xs" justify="center" mt="md">
              {profileData?.profile.badges?.map((badge) => (
                <Badge key={badge} variant="outline">
                  {badge}
                </Badge>
              ))}
            </Group>
            <Button variant="default" c="red" fullWidth mt="md">
              Keluar
            </Button>
          </Paper>

          <ProfileTab
            profileData={profileData}
            provinceData={provinceData}
            activitiesRegistration={activitiesRegistration}
            ruangcurhatData={ruangCurhatData}
          />
        </Flex>
      </Container>
    </main>
  );
}
