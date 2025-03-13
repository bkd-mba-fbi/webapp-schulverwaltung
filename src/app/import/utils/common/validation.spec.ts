import {
  isEmail,
  isInteger,
  isNumber,
  isOptionalEmail,
  isOptionalNumber,
  isPresent,
  isString,
} from "./validation";

describe("Import validation utility functions", () => {
  describe("isPresent", () => {
    it("returns true for 'Lorem ipsum'", () => {
      expect(isPresent("Lorem ipsum")).toBe(true);
    });

    it("returns true for 42", () => {
      expect(isPresent(42)).toBe(true);
    });

    it("returns false for ''", () => {
      expect(isPresent("")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isPresent(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isPresent(undefined)).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("returns true for 42", () => {
      expect(isNumber(42)).toBe(true);
    });

    it("returns true for 1.25", () => {
      expect(isNumber(1.25)).toBe(true);
    });

    it("returns false for 'Lorem ipsum'", () => {
      expect(isNumber("Lorem ipsum")).toBe(false);
    });

    it("returns false for ''", () => {
      expect(isNumber("")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isNumber(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe("isOptionalNumber", () => {
    it("returns true for 42", () => {
      expect(isOptionalNumber(42)).toBe(true);
    });

    it("returns true for 1.25", () => {
      expect(isOptionalNumber(1.25)).toBe(true);
    });

    it("returns false for 'Lorem ipsum'", () => {
      expect(isOptionalNumber("Lorem ipsum")).toBe(false);
    });

    it("returns true for ''", () => {
      expect(isOptionalNumber("")).toBe(true);
    });

    it("returns true for null", () => {
      expect(isOptionalNumber(null)).toBe(true);
    });

    it("returns true for undefined", () => {
      expect(isOptionalNumber(undefined)).toBe(true);
    });
  });

  describe("isInteger", () => {
    it("returns true for 42", () => {
      expect(isInteger(42)).toBe(true);
    });

    it("returns false for 1.25", () => {
      expect(isInteger(1.25)).toBe(false);
    });

    it("returns false for 'Lorem ipsum'", () => {
      expect(isInteger("Lorem ipsum")).toBe(false);
    });

    it("returns false for ''", () => {
      expect(isInteger("")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isInteger(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isInteger(undefined)).toBe(false);
    });
  });

  describe("isString", () => {
    it("returns true for 'Lorem ipsum'", () => {
      expect(isString("Lorem ipsum")).toBe(true);
    });

    it("returns false for 42", () => {
      expect(isString(42)).toBe(false);
    });

    it("returns false for 1.25", () => {
      expect(isString(1.25)).toBe(false);
    });

    it("returns false for ''", () => {
      expect(isString("")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isString(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isString(undefined)).toBe(false);
    });
  });

  describe("isEmail", () => {
    it("returns true for 's1@test.ch'", () => {
      expect(isEmail("s1@test.ch")).toBe(true);
    });

    it("returns false for 'Lorem ipsum'", () => {
      expect(isEmail("Lorem ipsum")).toBe(false);
    });

    it("returns false for 42", () => {
      expect(isEmail(42)).toBe(false);
    });

    it("returns false for 1.25", () => {
      expect(isEmail(1.25)).toBe(false);
    });

    it("returns false for ''", () => {
      expect(isEmail("")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isEmail(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isEmail(undefined)).toBe(false);
    });
  });

  describe("isOptionalEmail", () => {
    it("returns true for 's1@test.ch'", () => {
      expect(isOptionalEmail("s1@test.ch")).toBe(true);
    });

    it("returns false for 'Lorem ipsum'", () => {
      expect(isOptionalEmail("Lorem ipsum")).toBe(false);
    });

    it("returns false for 42", () => {
      expect(isOptionalEmail(42)).toBe(false);
    });

    it("returns false for 1.25", () => {
      expect(isOptionalEmail(1.25)).toBe(false);
    });

    it("returns true for ''", () => {
      expect(isOptionalEmail("")).toBe(true);
    });

    it("returns true for null", () => {
      expect(isOptionalEmail(null)).toBe(true);
    });

    it("returns true for undefined", () => {
      expect(isOptionalEmail(undefined)).toBe(true);
    });
  });
});
