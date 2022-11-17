import * as t from 'io-ts/lib/index';
import { decode, decodeArray, DecodeError } from './decode';

describe('decode utils', () => {
  const Foo = t.type({
    foo: t.string,
  });
  let success: jasmine.Spy;
  let error: jasmine.Spy;

  beforeEach(() => {
    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');
  });

  describe('decode', () => {
    const decoder = decode(Foo);

    it('decodes given data', () => {
      const data: unknown = { foo: 'bar' };
      decoder(data).subscribe({ next: success, error });
      expect(success).toHaveBeenCalledWith({ foo: 'bar' });
      expect(error).not.toHaveBeenCalled();
    });

    it('ignores additional attributes', () => {
      const data: unknown = { foo: 'bar', baz: 123 };
      decoder(data).subscribe({ next: success, error });
      expect(success).toHaveBeenCalledWith({ foo: 'bar', baz: 123 });
      expect(error).not.toHaveBeenCalled();
    });

    it('throws error if data is not valid', () => {
      const data: unknown = { foo: 123 };
      decoder(data).subscribe({ next: success, error });
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          'Invalid value 123 supplied to : { foo: string }/foo: string'
        )
      );
    });
  });

  describe('decodeArray', () => {
    const decoder = decodeArray(Foo);

    it('decodes given data', () => {
      const data: unknown = [{ foo: 'bar' }, { foo: 'baz' }];
      decoder(data).subscribe({ next: success, error });
      expect(success).toHaveBeenCalledWith([{ foo: 'bar' }, { foo: 'baz' }]);
      expect(error).not.toHaveBeenCalled();
    });

    it('throws error if data is not valid', () => {
      const data: unknown = [{ foo: 'bar' }, { bar: 'baz' }];
      decoder(data).subscribe({ next: success, error });
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          'Invalid value undefined supplied to : Array<{ foo: string }>/1: { foo: string }/foo: string'
        )
      );
    });
  });
});
