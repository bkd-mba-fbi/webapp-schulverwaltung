import { numberToString } from "./number";

describe("number utils", () => {
  describe("numberToString", () => {
    it("returns the string representation of a number", () => {
      expect(numberToString(42)).toBe("42");
    });

    it("returns the string representation of zero", () => {
      expect(numberToString(0)).toBe("0");
    });

    it("returns the string representation of a negative number", () => {
      expect(numberToString(-1.5)).toBe("-1.5");
    });

    it("returns null when value is null", () => {
      expect(numberToString(null)).toBeNull();
    });

    it("returns null when value is undefined", () => {
      expect(numberToString(undefined)).toBeNull();
    });
  });
});
