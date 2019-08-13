import {
  parseISOLocalDateTime,
  formatISOLocalDateTime,
  parseISOLocalDate,
  formatISOLocalDate
} from './date';

describe('date utils', () => {
  describe('.parseISOLocalDateTime', () => {
    it('returns a new date based on the given date time string', () => {
      const date = parseISOLocalDateTime('2019-08-07T11:00:00');
      expect(date.getFullYear()).toEqual(2019);
      expect(date.getMonth()).toEqual(7);
      expect(date.getDate()).toEqual(7);
      expect(date.getHours()).toEqual(11);
      expect(date.getMinutes()).toEqual(0);
      expect(date.getSeconds()).toEqual(0);
    });
  });

  describe('.parseISOLocalDate', () => {
    it('returns a new date based on the given date string', () => {
      const date = parseISOLocalDate('2019-08-07');
      expect(date.getFullYear()).toEqual(2019);
      expect(date.getMonth()).toEqual(7);
      expect(date.getDate()).toEqual(7);
      expect(date.getHours()).toEqual(0);
      expect(date.getMinutes()).toEqual(0);
      expect(date.getSeconds()).toEqual(0);
    });
  });

  describe('.formatISOLocalDateTime', () => {
    it('returns the given date formatted as iso string without timezone', () => {
      const dateString = formatISOLocalDateTime(
        new Date('2019-08-17T11:02:00')
      );
      expect(dateString).toEqual('2019-08-17T11:02:00');
    });
  });

  describe('.formatISOLocalDate', () => {
    it('returns the given date formatted as iso string without time', () => {
      const dateString = formatISOLocalDate(new Date('2019-08-17T11:02:00'));
      expect(dateString).toEqual('2019-08-17');
    });
  });
});
