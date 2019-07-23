import { Gender } from './common-types';
import { fold } from 'fp-ts/lib/Either';

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
});
