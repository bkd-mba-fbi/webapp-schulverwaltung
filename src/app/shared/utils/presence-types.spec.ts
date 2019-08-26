import { sortPresenceTypes } from './presence-types';
import { buildPresenceType } from 'src/spec-builders';

describe('presence types utilities', () => {
  describe('sortPresenceTypes', () => {
    it('sorts presence types by Sort attribute', () => {
      const presenceA = buildPresenceType(1, false, false);
      presenceA.Sort = 3;
      const presenceB = buildPresenceType(2, false, false);
      presenceB.Sort = 1;
      const presenceC = buildPresenceType(2, false, false);
      presenceC.Sort = 2;

      const result = sortPresenceTypes([presenceA, presenceB, presenceC]);
      expect(result).toEqual([presenceB, presenceC, presenceA]);
    });
  });
});
