import { describe, expect, it } from "vitest";
import { formatYen } from "@/lib/assets/format-yen";

describe("formatYen", () => {
  it("formats JPY values without fractional units", () => {
    expect(formatYen(1234)).toContain("1,234");
  });

  it("rejects non-finite amounts", () => {
    expect(() => formatYen(Number.NaN)).toThrow(RangeError);
    expect(() => formatYen(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
