"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { Tabs, Stack } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import PersonalDataForm from "../PersonalDataForm";
import PersonalActivityData from "../PersonalActivityData";
import PersonalAchievementData from "../PersonalAchievementData";
import RuangCurhatList from "../RuangCurhatList";
import ProfileHeader from "../ProfileHeader";
import ProfileSectionError from "../ProfileSectionError";
import { PROFILE_TABS, profileTabId } from "../types";
import type { ProfileSections } from "../types";
import classes from "./index.module.css";

type ProfileTabProps = { sections: ProfileSections; token: string };
export function ProfileTab({ sections, token }: ProfileTabProps): ReactElement {
  const searchParams = useSearchParams();
  const activeTab = profileTabId(searchParams.get("tab"));
  const [savedName, setSavedName] = useState<string>();
  const [availableProfile, setAvailableProfile] = useState(
    sections.profile.data,
  );
  if (sections.profile.data && sections.profile.data !== availableProfile)
    setAvailableProfile(sections.profile.data);
  function changeTab(value: string | null): void {
    const nextTab = profileTabId(value);
    if (nextTab === activeTab) return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", nextTab);
    window.history.pushState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }
  return (
    <Stack gap="lg">
      {availableProfile && (
        <ProfileHeader
          profileData={availableProfile}
          token={token}
          savedName={savedName}
        />
      )}
      <Tabs
        variant="pills"
        color="blue.8"
        value={activeTab}
        onChange={changeTab}
        keepMounted
        keepMountedMode="display-none"
        className={classes.tab}
      >
        <Tabs.List
          aria-label="Bagian profil"
          onKeyDownCapture={(event) => {
            if (event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            const value = event.key === "Home" ? "profiledata" : "achievements";
            const index = event.key === "Home" ? 0 : 3;
            event.currentTarget
              .querySelectorAll<HTMLButtonElement>('[role="tab"]')
              [index]?.focus();
            changeTab(value);
          }}
        >
          {Object.entries(PROFILE_TABS).map(([value, label]) => (
            <Tabs.Tab key={value} value={value}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="profiledata" pt="lg" tabIndex={0}>
          <Stack gap="md">
            {sections.profile.error && (
              <ProfileSectionError message={sections.profile.error} />
            )}
            {availableProfile && (
              <PersonalDataForm
                profileData={availableProfile}
                provinces={sections.provinces.data}
                countries={sections.countries.data}
                provinceError={sections.provinces.error}
                countryError={sections.countries.error}
                onSaved={setSavedName}
              />
            )}
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="activity" pt="lg" tabIndex={0}>
          {sections.activities.data ? (
            <PersonalActivityData activities={sections.activities.data} />
          ) : (
            <ProfileSectionError message={sections.activities.error} />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="ruangcurhat" pt="lg" tabIndex={0}>
          {sections.consultations.data ? (
            <RuangCurhatList data={sections.consultations.data} />
          ) : (
            <ProfileSectionError message={sections.consultations.error} />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="achievements" pt="lg" tabIndex={0}>
          {sections.achievements.data ? (
            <PersonalAchievementData
              achievements={sections.achievements.data}
            />
          ) : (
            <ProfileSectionError message={sections.achievements.error} />
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
