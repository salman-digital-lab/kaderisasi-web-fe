import { describe, expect, it } from "vitest";
import {
  buildClubsHref,
  getPaginationItems,
  parseClubListQuery,
} from "./list-query";

describe("Club list query helpers", () => {
  it("normalizes search, type, and positive page values", () => {
    expect(
      parseClubListQuery({
        search: ["  panahan  ", "ignored"],
        type: "UKM",
        page: "3",
      }),
    ).toEqual({ search: "panahan", clubType: "UKM", page: 3 });

    expect(parseClubListQuery({ type: "invalid", page: "0" })).toEqual({
      search: "",
      clubType: undefined,
      page: 1,
    });

    expect(parseClubListQuery({ search: "a".repeat(101) }).search).toHaveLength(
      100,
    );
  });

  it("builds encoded URLs while omitting the default page", () => {
    expect(
      buildClubsHref({ search: "  Salman & ITB ", clubType: "AVISMAN" }),
    ).toBe("/clubs?search=Salman+%26+ITB&type=AVISMAN");
    expect(buildClubsHref({ search: "", page: 4 })).toBe("/clubs?page=4");
  });

  it("keeps pagination compact around the current page", () => {
    expect(getPaginationItems(1, 3)).toEqual([1, 2, 3]);
    expect(getPaginationItems(1, 12)).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
    expect(getPaginationItems(6, 12)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      12,
    ]);
    expect(getPaginationItems(12, 12)).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      11,
      12,
    ]);
  });
});
