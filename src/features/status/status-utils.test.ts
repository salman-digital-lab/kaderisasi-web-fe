import { describe, expect, it } from "vitest";
import { formatStatusDate, statusLabel } from "./status-utils";

describe("status presentation", () => {
  it("preserves distinct status labels", () => {
    expect(
      ["DITERIMA", "LULUS KEGIATAN", "TIDAK DITERIMA", "TIDAK LULUS"].map(
        statusLabel,
      ),
    ).toEqual(["Diterima", "Lulus kegiatan", "Tidak diterima", "Tidak lulus"]);
  });
  it("formats announcement and registration dates in Jakarta, including a UTC day boundary", () => {
    expect(formatStatusDate("2026-09-25T20:00:00Z")).toBe("26 September 2026");
    expect(formatStatusDate("2026-09-25T20:00:00Z", true)).toContain(
      "03.00 WIB",
    );
    for (const value of [undefined, "", "invalid"])
      expect(formatStatusDate(value, true)).toBeNull();
  });
});
