import { describe, expect, it } from "vitest";
import { profileHistorySchema } from "./history-schema";
import { normalizeEducationHistory, normalizeWorkHistory } from "@/utils/profile-history";
import { selectCurrentEducation } from "@/features/customForm/education-history";

describe("profile histories across forms", () => {
  it("loads imported partial entries, string years, and null elements safely", () => {
    expect(normalizeEducationHistory(JSON.stringify([null, {
      degree: "bachelor", institution: " ITB ", major: "Informatika", intake_year: "2017",
    }]))).toEqual([{
      degree: "bachelor", institution: "ITB", faculty: "", major: "Informatika", intake_year: 2017,
    }]);
    expect(normalizeWorkHistory([null, { job_title: "Engineer", company: "Company", start_year: "2021", end_year: null }]))
      .toEqual([{ job_title: "Engineer", company: "Company", start_year: 2021, end_year: undefined }]);
    for (const value of [undefined, null, {}, "invalid", 3]) {
      expect(normalizeEducationHistory(value)).toEqual([]);
      expect(normalizeWorkHistory(value)).toEqual([]);
    }
  });

  it("keeps omitted histories omitted and explicit empty histories clearable", () => {
    expect(profileHistorySchema.parse({ name: "Name" })).toEqual({});
    expect(profileHistorySchema.parse({ education_history: [], work_history: [] }))
      .toEqual({ education_history: [], work_history: [] });
    expect(profileHistorySchema.parse({ education_history: [{ major: "Physics", intake_year: null }] }))
      .toEqual({ education_history: [{ institution: "", faculty: "", major: "Physics", intake_year: undefined }] });
  });

  it("normalizes empty optional years and rejects incomplete jobs or invalid ranges", () => {
    expect(profileHistorySchema.parse({ work_history: [{
      job_title: " Engineer ", company: " Company ", start_year: "2021", end_year: "",
    }] })).toEqual({ work_history: [{ job_title: "Engineer", company: "Company", start_year: 2021, end_year: undefined }] });
    for (const entry of [
      { job_title: "Engineer", company: "" },
      { job_title: " ", company: "Company" },
      { job_title: "Engineer", company: "Company", start_year: 2025, end_year: 2021 },
      { job_title: "Engineer", company: "Company", start_year: 2021.5 },
    ]) expect(profileHistorySchema.safeParse({ work_history: [entry] }).success).toBe(false);
  });

  it("preserves history edits when a stale current-education copy is selected", () => {
    const history = normalizeEducationHistory([
      { institution: "Updated A", major: "Physics" },
      { institution: "B" },
    ]);
    const stale = { ...history[0]!, institution: "Old A" };
    expect(selectCurrentEducation(history, stale, "0")).toEqual([history[1], history[0]]);
    expect(selectCurrentEducation(history, stale, "0", true)).toEqual([history[1], stale]);
    expect(selectCurrentEducation(history, stale, "9")).toEqual(history);
    expect(selectCurrentEducation(history, undefined, null)).toEqual(history);
    expect(selectCurrentEducation(history, stale, "new")).toEqual([...history, stale]);
  });
});
