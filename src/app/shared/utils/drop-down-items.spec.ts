import {
  keyToNumber,
  keyToString,
  keysToNumbers,
  keysToStrings,
} from "./drop-down-items";

describe("drop down items utils", () => {
  describe("keyToNumber", () => {
    it("returns null as-is", () => {
      expect(keyToNumber(null)).toBeNull();
    });

    it("returns number as-is", () => {
      expect(keyToNumber(42)).toBe(42);
    });

    it("returns string as number", () => {
      expect(keyToNumber("42")).toBe(42);
    });
  });

  describe("keysToNumbers", () => {
    it("returns null as-is", () => {
      expect(keysToNumbers(null)).toBeNull();
    });

    it("returns keys as numbers", () => {
      expect(keysToNumbers([42, "23"])).toEqual([42, 23]);
    });
  });

  describe("keyToString", () => {
    it("returns null as-is", () => {
      expect(keyToString(null)).toBeNull();
    });

    it("returns string as-is", () => {
      expect(keyToString("Foo bar")).toBe("Foo bar");
    });

    it("returns number as string", () => {
      expect(keyToString(42)).toBe("42");
    });
  });

  describe("keysToStrings", () => {
    it("returns null as-is", () => {
      expect(keysToStrings(null)).toBeNull();
    });

    it("returns keys as strings", () => {
      expect(keysToStrings(["Foo bar", 42])).toEqual(["Foo bar", "42"]);
    });
  });
});
