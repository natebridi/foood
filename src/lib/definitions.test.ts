import { describe, it, expect } from "vitest";
import { measures } from "./definitions";

describe("measures", () => {
  it("has 16 entries", () => {
    expect(measures).toHaveLength(16);
  });

  it("each entry has full, plural, and short fields", () => {
    for (const m of measures) {
      expect(typeof m.full).toBe("string");
      expect(typeof m.plural).toBe("string");
      expect(typeof m.short).toBe("string");
    }
  });

  it("cup is the first entry", () => {
    expect(measures[0].full).toBe("cup");
  });

  it("all string fields are non-empty", () => {
    for (const m of measures) {
      expect(m.full.length).toBeGreaterThan(0);
      expect(m.plural.length).toBeGreaterThan(0);
      expect(m.short.length).toBeGreaterThan(0);
    }
  });
});
