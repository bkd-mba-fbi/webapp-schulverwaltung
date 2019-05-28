import { spreadTuple, spreadTriplet } from './function';

describe('function utils', () => {
  describe('spreadTuple', () => {
    it('spreads the received tuple argument to the wrapped binary function', () => {
      function repeatStr(str: string, num: number): string {
        return new Array(num).fill(str).join('');
      }
      const wrappedRepeatStr = spreadTuple(repeatStr);
      expect(wrappedRepeatStr(['foo', 3])).toEqual('foofoofoo');
    });
  });

  describe('spreadTriplet', () => {
    it('spreads the received triplet argument to the wrapped ternary function', () => {
      const result = spreadTriplet((a, b, c) => `a:${a}, b:${b}, c:${c}`)([
        'foo',
        'bar',
        'baz'
      ]);
      expect(result).toEqual('a:foo, b:bar, c:baz');
    });
  });
});
