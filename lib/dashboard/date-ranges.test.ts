import { describe, expect, it } from "vitest";
import { getDashboardDateRanges } from "./date-ranges";

describe("getDashboardDateRanges", () => {
  it("uses the configured timezone at month boundaries", () => {
    const ranges = getDashboardDateRanges(new Date("2026-03-01T00:30:00.000Z"), "Europe/Madrid");

    expect(ranges.dayStart.toISOString()).toBe("2026-02-28T23:00:00.000Z");
    expect(ranges.monthStart.toISOString()).toBe("2026-02-28T23:00:00.000Z");
    expect(ranges.previousMonthStart.toISOString()).toBe("2026-01-31T23:00:00.000Z");
  });

  it("handles daylight-saving time without assuming 24-hour days", () => {
    const ranges = getDashboardDateRanges(new Date("2026-03-29T12:00:00.000Z"), "Europe/Madrid");

    expect(ranges.dayStart.toISOString()).toBe("2026-03-28T23:00:00.000Z");
    expect(ranges.dayEnd.toISOString()).toBe("2026-03-29T22:00:00.000Z");
  });
});
