"use client";

import { useState, useTransition, useEffect } from "react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import PersonalDataForm from "../PersonalDataForm";
import PersonalActivityData from "../PersonalActivityData";
import PersonalAchievementData from "../PersonalAchievementData";
import { ProfileCard } from "../ProfileCard";

import classes from "./index.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import RuangCurhatList from "../RuangCurhatList";
import { Province } from "@/types/model/province";
import { PublicUser } from "@/types/model/members";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import { Activity, Registrant } from "@/types/model/activity";
import { Member } from "@/types/model/members";
import { Achievement } from "@/types/model/achievement";
import {
  PersonalDataFormSkeleton,
  ActivityListSkeleton,
  AchievementListSkeleton,
} from "@/components/skeletons/ProfileTabSkeleton";

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
  token: string;
};

export function ProfileTab({
  provinceData,
  profileData,
  activitiesRegistration,
  ruangcurhatData,
  achievements,
  token,
}: ProfileTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const urlTab = searchParams.get("tab") ?? "profiledata";
  const [activeTab, setActiveTab] = useState(urlTab);

  // Sync activeTab when URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (!isPending) {
      setActiveTab(urlTab);
    }
  }, [urlTab, isPending]);

  const onChangeTab = (value: string | null) => {
    const newTab = value || "profiledata";
    setActiveTab(newTab); // Update immediately for instant feedback
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);

    startTransition(() => {
      router.push("/profile?" + params, { scroll: false });
    });
  };

  return (
    <Tabs
      variant="pills"
      value={activeTab}
      className={classes.tab}
      onChange={onChangeTab}
    >
      <TabsList>
        <TabsTab value="profiledata">Data Diri</TabsTab>
        <TabsTab value="activity">Kegiatan</TabsTab>
        <TabsTab value="ruangcurhat">Ruang Curhat</TabsTab>
        <TabsTab value="achievements">Prestasi</TabsTab>
      </TabsList>

      {/* Profile Card - Mobile only, shown when Data Diri tab is active */}
      {activeTab === "profiledata" && (
        <ProfileCard
          profileData={profileData}
          activitiesRegistration={activitiesRegistration}
          achievements={achievements}
          token={token}
          className={classes.mobileProfileCard}
          showLogoutButton={false}
        />
      )}

      <TabsPanel value="profiledata" mt="md">
        {isPending ? (
          <PersonalDataFormSkeleton />
        ) : (
          <PersonalDataForm
            provinces={provinceData}
            profileData={profileData}
          />
        )}
      </TabsPanel>
      <TabsPanel value="activity" mt="md">
        {isPending ? (
          <ActivityListSkeleton />
        ) : (
          <PersonalActivityData activities={activitiesRegistration || []} />
        )}
      </TabsPanel>
      <TabsPanel value="ruangcurhat" mt="md">
        {isPending ? (
          <ActivityListSkeleton />
        ) : (
          <RuangCurhatList data={ruangcurhatData || []} />
        )}
      </TabsPanel>
      <TabsPanel value="achievements" mt="md">
        {isPending ? (
          <AchievementListSkeleton />
        ) : (
          <PersonalAchievementData achievements={achievements || []} />
        )}
      </TabsPanel>
    </Tabs>
  );
}
