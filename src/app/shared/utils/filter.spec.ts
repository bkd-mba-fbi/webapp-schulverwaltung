import { nonZero, not } from './filter';

describe('filter utils', () => {
  describe('nonZero', () => {
    it('returns true for positive numbers', () => {
      expect(nonZero(1)).toBe(true);
      expect(nonZero(2)).toBe(true);
      expect(nonZero(1000)).toBe(true);
    });

    it('returns false for zero', () => {
      expect(nonZero(0)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(nonZero(-1)).toBe(true);
      expect(nonZero(-2)).toBe(true);
      expect(nonZero(-1000)).toBe(true);
    });
  });

  describe('not', () => {
    it('returns function that calls given function and negates its result', () => {
      expect(
        not(arg => {
          expect(arg).toBe(123);
          return true;
        })(123)
      ).toBe(false);

      expect(
        not(arg => {
          expect(arg).toBe(123);
          return false;
        })(123)
      ).toBe(true);
    });
  });
});
