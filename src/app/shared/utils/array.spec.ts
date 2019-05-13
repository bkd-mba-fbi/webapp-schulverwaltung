import { previousElement, nextElement } from './array';

describe('array utils', () => {
  describe('previousElement', () => {
    const array: ReadonlyArray<{ id: number }> = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    const eq = (a: any, b: any) => a.id === b.id;

    it('returns previous entry', () => {
      expect(previousElement(eq)({ id: 2 }, array)).toEqual({ id: 1 });
    });

    it('returns null if current entry is null', () => {
      expect(previousElement(eq)(null, array)).toBeNull();
    });

    it('returns null if entries are empty', () => {
      expect(
        previousElement(eq)({ id: 2 }, [] as ReadonlyArray<string>)
      ).toBeNull();
    });

    it('returns null if current entry is first entry', () => {
      expect(previousElement(eq)({ id: 1 }, array)).toBeNull();
    });
  });

  describe('nextElement', () => {
    const array: ReadonlyArray<{ id: number }> = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    const eq = (a: any, b: any) => a.id === b.id;

    it('returns next entry', () => {
      expect(nextElement(eq)({ id: 2 }, array)).toEqual({ id: 3 });
    });

    it('returns null if current entry is null', () => {
      expect(nextElement(eq)(null, array)).toBeNull();
    });

    it('returns null if entries are empty', () => {
      expect(
        nextElement(eq)({ id: 2 }, [] as ReadonlyArray<string>)
      ).toBeNull();
    });

    it('returns null if current entry is last entry', () => {
      expect(nextElement(eq)({ id: 3 }, array)).toBeNull();
    });
  });
});
