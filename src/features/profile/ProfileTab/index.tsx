"use client";

import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import PersonalDataForm from "../PersonalDataForm";
import PersonalActivityData from "../PersonalActivityData";
import PersonalAchievementData from "../PersonalAchievementData";

import classes from "./index.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import RuangCurhatList from "../RuangCurhatList";
import { Province } from "@/types/model/province";
import { PublicUser } from "@/types/model/members";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import { Activity, Registrant } from "@/types/model/activity";
import { Member } from "@/types/model/members";
import { Achievement } from "@/types/model/achievement";

type ProfileTabProps = {
  provinceData: Province[] | undefined;
  profileData:
  | {
    userData: PublicUser;
    profile: Member;
  }
  | undefined;
  activitiesRegistration: ({ activity: Activity } & Registrant)[] | undefined;
  ruangcurhatData: RuangCurhatData[] | undefined;
  achievements: Achievement[] | undefined;
};

export function ProfileTab({
  provinceData,
  profileData,
  activitiesRegistration,
  ruangcurhatData,
  achievements,
}: ProfileTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const onChangeTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", String(value));

    router.push("/profile?" + params, { scroll: false });
  };

  return (
    <Tabs
      variant="pills"
      defaultValue={currentTab ?? "profiledata"}
      className={classes.tab}
      onChange={(val) => onChangeTab(val || "")}
    >
      <TabsList>
        <TabsTab value="profiledata">Data Diri</TabsTab>
        <TabsTab value="activity">Kegiatan</TabsTab>
        <TabsTab value="ruangcurhat">Ruang Curhat</TabsTab>
        <TabsTab value="achievements">Prestasi</TabsTab>
      </TabsList>
      <TabsPanel value="profiledata" mt="md">
        <PersonalDataForm
          provinces={provinceData}
          profileData={profileData}
        />
      </TabsPanel>
      <TabsPanel value="activity" mt="md">
        <PersonalActivityData activities={activitiesRegistration || []} />
      </TabsPanel>
      <TabsPanel value="ruangcurhat" mt="md">
        <RuangCurhatList data={ruangcurhatData || []} />
      </TabsPanel>
      <TabsPanel value="achievements" mt="md">
        <PersonalAchievementData achievements={achievements || []} />
      </TabsPanel>
    </Tabs>
  );
}
