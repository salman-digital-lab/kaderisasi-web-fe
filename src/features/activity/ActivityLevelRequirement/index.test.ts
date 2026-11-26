import { describe, expect, it } from "vitest";
import { meetsActivityLevel } from ".";

describe("meetsActivityLevel", () => {
  it("accepts a member at or above the minimum level", () => {
    expect(meetsActivityLevel(6, 6)).toBe(true);
    expect(meetsActivityLevel(10, 3)).toBe(true);
    expect(meetsActivityLevel(0, 0)).toBe(true);
  });

  it("rejects a member below the minimum or without a level", () => {
    expect(meetsActivityLevel(3, 6)).toBe(false);
    expect(meetsActivityLevel(undefined, 0)).toBe(false);
  });
});
