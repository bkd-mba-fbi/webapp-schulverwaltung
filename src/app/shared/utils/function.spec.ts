import { spreadTuple } from './function';

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
});
