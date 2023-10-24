import { fold } from 'fp-ts/es6/Either';
import {
  NotificationChannels,
  NotificationTypesInactive,
} from './user-settings.model';

describe('user settings types', () => {
  describe('NotificationChannels', () => {
    let left: jasmine.Spy;
    let right: jasmine.Spy;

    beforeEach(() => {
      left = jasmine.createSpy('left');
      right = jasmine.createSpy('right');
    });

    describe('decoding', () => {
      it('converts JSON string to empty object', () => {
        fold(left, right)(NotificationChannels.decode('{}'));
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith({
          mail: false,
          gui: false,
          phoneMobile: false,
        });
      });

      it('converts JSON string with truthy values to object', () => {
        fold(
          left,
          right,
        )(
          NotificationChannels.decode(
            '{"mail":true,"gui":true,"phoneMobile":true}',
          ),
        );
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith({
          mail: true,
          gui: true,
          phoneMobile: true,
        });
      });

      it('converts JSON string with falsy values to object', () => {
        fold(
          left,
          right,
        )(
          NotificationChannels.decode(
            '{"mail":false,"gui":false,"phoneMobile":false}',
          ),
        );
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith({
          mail: false,
          gui: false,
          phoneMobile: false,
        });
      });

      it('falls back to default values for JSON string with invalid properties', () => {
        fold(
          left,
          right,
        )(
          NotificationChannels.decode(
            '{"mail":123,"gui":"foo","phoneMobile":{}}',
          ),
        );
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith({
          mail: false,
          gui: false,
          phoneMobile: false,
        });
      });

      it('fails for invalid type', () => {
        fold(left, right)(NotificationChannels.decode({}));
        expect(left).toHaveBeenCalled();
        expect(right).not.toHaveBeenCalled();
      });

      it('fails for invalid string', () => {
        fold(left, right)(NotificationChannels.decode(''));
        expect(left).toHaveBeenCalled();
        expect(right).not.toHaveBeenCalled();
      });
    });

    describe('encoding', () => {
      it('converts object to JSON string', () => {
        expect(
          NotificationChannels.encode({
            mail: true,
            gui: false,
            phoneMobile: true,
          }),
        ).toEqual('{"mail":true,"gui":false,"phoneMobile":true}');
      });
    });
  });

  describe('NotificationTypesInactive', () => {
    let left: jasmine.Spy;
    let right: jasmine.Spy;

    beforeEach(() => {
      left = jasmine.createSpy('left');
      right = jasmine.createSpy('right');
    });

    describe('decoding', () => {
      it('converts semicolon-separated string to array', () => {
        fold(
          left,
          right,
        )(
          NotificationTypesInactive.decode(
            'BM2Teacher;absenceMessage;teacherSubstitutions',
          ),
        );
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith([
          'BM2Teacher',
          'absenceMessage',
          'teacherSubstitutions',
        ]);
      });

      it('converts single-value string to array', () => {
        fold(left, right)(NotificationTypesInactive.decode('BM2Teacher'));
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith(['BM2Teacher']);
      });

      it('converts empty string to empty array', () => {
        fold(left, right)(NotificationTypesInactive.decode(''));
        expect(left).not.toHaveBeenCalled();
        expect(right).toHaveBeenCalledWith([]);
      });

      it('fails for invalid value', () => {
        fold(left, right)(NotificationTypesInactive.decode({}));
        expect(left).toHaveBeenCalled();
        expect(right).not.toHaveBeenCalled();
      });

      it('fails for array with invalid value', () => {
        fold(
          left,
          right,
        )(
          NotificationTypesInactive.decode([
            'BM2Teacher',
            123,
            'absenceMessage',
          ]),
        );
        expect(left).toHaveBeenCalled();
        expect(right).not.toHaveBeenCalled();
      });
    });

    describe('encoding', () => {
      it('converts array to semicolon-separated string', () => {
        expect(
          NotificationTypesInactive.encode([
            'BM2Teacher',
            'absenceMessage',
            'teacherSubstitutions',
          ]),
        ).toEqual('BM2Teacher;absenceMessage;teacherSubstitutions');
      });

      it('converts single-value array to string', () => {
        expect(NotificationTypesInactive.encode(['BM2Teacher'])).toEqual(
          'BM2Teacher',
        );
      });
    });
  });
});
