import { nonZero } from './filter';

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
});
