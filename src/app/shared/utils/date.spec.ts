import { parseISOLocal, formatISOLocal } from './date';
import { format } from 'url';

describe('date utils', () => {
  describe('.parseISOLocal', () => {
    it('returns a new date based on the given string', () => {
      const date = parseISOLocal('2019-08-07T11:00:00');
      expect(date.getFullYear()).toEqual(2019);
      expect(date.getMonth()).toEqual(7);
      expect(date.getDate()).toEqual(7);
      expect(date.getHours()).toEqual(11);
      expect(date.getMinutes()).toEqual(0);
      expect(date.getSeconds()).toEqual(0);
    });
  });

  describe('.formatISOLocal', () => {
    it('returns the given date formatted as iso string without timezone', () => {
      const dateString = formatISOLocal(new Date('2019-08-17T11:02:00'));
      expect(dateString).toEqual('2019-08-17T11:02:00');
    });
  });
});
