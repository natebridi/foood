import { describe, it, expect } from "vitest";
import { generateSlug, replaceFractions } from "./utils";

describe("generateSlug", () => {
  it("converts spaces to dashes", () => {
    expect(generateSlug("Pasta Primavera")).toBe("pasta-primavera");
  });

  it("collapses multiple spaces into one dash", () => {
    expect(generateSlug("Chicken  Rice")).toBe("chicken-rice");
  });

  it("strips special characters", () => {
    expect(generateSlug("Mom's Chili & Cornbread!")).toBe("moms-chili-cornbread");
  });

  it("strips leading and trailing dashes", () => {
    expect(generateSlug("- recipe -")).toBe("recipe");
  });

  it("lowercases everything", () => {
    expect(generateSlug("TACOS")).toBe("tacos");
  });

  it("returns an empty string for an empty input", () => {
    expect(generateSlug("")).toBe("");
  });

  it("collapses consecutive dashes", () => {
    expect(generateSlug("fish & chips")).toBe("fish-chips");
  });
});

describe("replaceFractions", () => {
  it("converts 0.5 to ½", () => {
    expect(replaceFractions("0.5")).toBe("½");
  });

  it("converts 0.25 to ¼", () => {
    expect(replaceFractions("0.25")).toBe("¼");
  });

  it("converts 0.75 to ¾", () => {
    expect(replaceFractions("0.75")).toBe("¾");
  });

  it("converts 0.33 to ⅓", () => {
    expect(replaceFractions("0.33")).toBe("⅓");
  });

  it("converts 0.67 to ⅔", () => {
    expect(replaceFractions("0.67")).toBe("⅔");
  });

  it("returns a whole number as a string with no fraction", () => {
    expect(replaceFractions("2")).toBe("2");
  });

  it("combines whole number and fraction for mixed values", () => {
    expect(replaceFractions("1.5")).toBe("1½");
  });

  it("returns only the fraction character for values less than 1", () => {
    expect(replaceFractions("0.5")).not.toContain("0");
  });
});
