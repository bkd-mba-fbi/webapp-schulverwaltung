import { isEmail } from "./email";

describe("email utils", () => {
  describe("isEmail", () => {
    it("returns true for a valid email", () => {
      expect(isEmail("john.doe@example.com")).toBe(true);
    });

    it("returns true for an email without a TLD", () => {
      expect(isEmail("foo@localhost")).toBe(true);
    });

    it("returns false for 'Lorem ipsum dolor sit amet'", () => {
      expect(isEmail("Lorem ipsum dolor sit amet")).toBe(false);
    });

    it("returns false for 'foobar'", () => {
      expect(isEmail("foobar")).toBe(false);
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
});
