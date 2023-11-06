import {
  isArray,
  isEmptyArray,
  length,
  nextElement,
  previousElement,
} from "./array";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("array utils", () => {
  describe("previousElement", () => {
    const array: ReadonlyArray<{ id: number }> = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    const eq = (a: any, b: any) => a.id === b.id;

    it("returns previous entry", () => {
      expect(previousElement(eq)({ id: 2 }, array)).toEqual({ id: 1 });
    });

    it("returns null if current entry is null", () => {
      expect(previousElement(eq)(null, array)).toBeNull();
    });

    it("returns null if entries are empty", () => {
      expect(
        previousElement(eq)({ id: 2 }, [] as ReadonlyArray<string>),
      ).toBeNull();
    });

    it("returns null if current entry is first entry", () => {
      expect(previousElement(eq)({ id: 1 }, array)).toBeNull();
    });
  });

  describe("nextElement", () => {
    const array: ReadonlyArray<{ id: number }> = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    const eq = (a: any, b: any) => a.id === b.id;

    it("returns next entry", () => {
      expect(nextElement(eq)({ id: 2 }, array)).toEqual({ id: 3 });
    });

    it("returns null if current entry is null", () => {
      expect(nextElement(eq)(null, array)).toBeNull();
    });

    it("returns null if entries are empty", () => {
      expect(
        nextElement(eq)({ id: 2 }, [] as ReadonlyArray<string>),
      ).toBeNull();
    });

    it("returns null if current entry is last entry", () => {
      expect(nextElement(eq)({ id: 3 }, array)).toBeNull();
    });
  });

  describe("isEmptyArray", () => {
    it("is true for empty array", () => {
      expect(isEmptyArray([])).toBe(true);
    });

    it("is false for non-empty array", () => {
      expect(isEmptyArray([1, 2, 3])).toBe(false);
      expect(isEmptyArray([null])).toBe(false);
      expect(isEmptyArray(["foobar"])).toBe(false);
    });
  });

  describe("length", () => {
    it("returns 0 if array is empty", () => {
      expect(length([])).toBe(0);
    });

    it("returns 1 if array has one element", () => {
      expect(length([1])).toBe(1);
    });

    it("returns 3 if array has three elements", () => {
      expect(length([1, 2, 3])).toBe(3);
    });
  });

  describe("isArray", () => {
    it("returns false if is no array", () => {
      expect(isArray(undefined)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(1)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray("foo")).toBe(false);
    });

    it("returns true if is array", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });
  });
});
