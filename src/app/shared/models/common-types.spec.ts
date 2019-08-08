import { Gender, DateFromString } from './common-types';
import { fold } from 'fp-ts/lib/Either';
import { parseISOLocal } from '../utils/date';

describe('common types', () => {
  describe('Gender', () => {
    let left: jasmine.Spy;
    let right: jasmine.Spy;

    beforeEach(() => {
      left = jasmine.createSpy('left');
      right = jasmine.createSpy('right');
    });

    it('accepts "M"', () => {
      fold(left, right)(Gender.decode('M'));
      expect(left).not.toHaveBeenCalled();
      expect(right).toHaveBeenCalledWith('M');
    });

    it('accepts "F"', () => {
      fold(left, right)(Gender.decode('F'));
      expect(left).not.toHaveBeenCalled();
      expect(right).toHaveBeenCalledWith('F');
    });

    it('maps 1 to "M"', () => {
      fold(left, right)(Gender.decode(1));
      expect(left).not.toHaveBeenCalled();
      expect(right).toHaveBeenCalledWith('M');
    });

    it('maps 2 to "F"', () => {
      fold(left, right)(Gender.decode(1));
      expect(left).not.toHaveBeenCalled();
      expect(right).toHaveBeenCalledWith('M');
    });

    it('fails for invalid values', () => {
      fold(left, right)(Gender.decode('foo'));
      expect(left).toHaveBeenCalled();
      expect(right).not.toHaveBeenCalled();
    });
  });

  describe('DateFromString', () => {
    let left: jasmine.Spy;
    let right: jasmine.Spy;

    beforeEach(() => {
      left = jasmine.createSpy('left');
      right = jasmine.createSpy('right');
    });

    it('converts string to date', () => {
      fold(left, right)(DateFromString.decode('2019-08-07T11:00:00'));
      expect(left).not.toHaveBeenCalled();
      expect(right).toHaveBeenCalledWith(parseISOLocal('2019-08-07T11:00:00'));
    });

    it('fails for invalid values', () => {
      fold(left, right)(DateFromString.decode('foo'));
      expect(left).toHaveBeenCalled();
      expect(right).not.toHaveBeenCalled();
    });

    it('formats given date', () => {
      expect(DateFromString.encode(new Date('2019-08-07T11:00:00'))).toEqual(
        '2019-08-07T11:00:00'
      );
    });
  });
});
