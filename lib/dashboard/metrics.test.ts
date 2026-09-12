import { describe, expect, it } from "vitest";
import { calculateChange, calculatePercentage } from "./metrics";

describe("dashboard metric calculations", () => {
  it("calculates rounded plan percentages", () => {
    expect(calculatePercentage(1, 3)).toBe(33.3);
  });

  it("returns zero when no members have a plan", () => {
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it("calculates month-over-month change", () => {
    expect(calculateChange(150, 100)).toBe(50);
    expect(calculateChange(75, 100)).toBe(-25);
  });

  it("does not invent a comparison when the previous month is zero", () => {
    expect(calculateChange(100, 0)).toBeNull();
  });
});
