import {
  nonZero,
  not,
  notNull,
  isTruthy,
  isInstanceOf,
  unique,
} from './filter';

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

  describe('notNull', () => {
    it('returns true for non null value', () => {
      expect(notNull(0)).toBe(true);
      expect(notNull('')).toBe(true);
      expect(notNull('null')).toBe(true);
      expect(notNull({})).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(notNull(undefined)).toBe(true);
    });

    it('returns false for null', () => {
      expect(notNull(null)).toBe(false);
    });
  });

  describe('not', () => {
    it('returns function that calls given function and negates its result', () => {
      expect(
        not((arg) => {
          expect(arg).toBe(123);
          return true;
        })(123)
      ).toBe(false);

      expect(
        not((arg) => {
          expect(arg).toBe(123);
          return false;
        })(123)
      ).toBe(true);
    });
  });

  describe('isTruthy', () => {
    it('returns true for truthy value', () => {
      expect(isTruthy(true)).toEqual(true);
      expect(isTruthy('true')).toEqual(true);
      expect(isTruthy(1)).toEqual(true);
      expect(isTruthy('1')).toEqual(true);
      expect(isTruthy('foo')).toEqual(true);
      expect(isTruthy('0')).toEqual(true);
      expect(isTruthy('undefined')).toEqual(true);
      expect(isTruthy('null')).toEqual(true);
    });

    it('returns false for falsy value', () => {
      expect(isTruthy(false)).toEqual(false);
      expect(isTruthy(0)).toEqual(false);
      expect(isTruthy('')).toEqual(false);
      expect(isTruthy(null)).toEqual(false);
      expect(isTruthy(undefined)).toEqual(false);
    });
  });

  describe('isInstanceOf', () => {
    class Foo {}
    class Bar {}

    it('returns true if is instance of given class', () => {
      expect(isInstanceOf(Foo)(new Foo())).toBe(true);
    });

    it('returns false if is not instance of given class', () => {
      expect(isInstanceOf(Foo)(new Bar())).toBe(false);
    });
  });

  describe('unique', () => {
    it('filters list of primitives and keeps only unique value in array', () => {
      expect([1, 2, 3, 4, 4, 3, 5].filter(unique)).toEqual([1, 2, 3, 4, 5]);
      expect(['a', 'b', 'c', 'a', 'b', 'c', 'd'].filter(unique)).toEqual([
        'a',
        'b',
        'c',
        'd',
      ]);
    });
  });
});
