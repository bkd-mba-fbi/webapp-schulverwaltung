import { parseQueryString, serializeParams } from './url';

describe('url utilities', () => {
  describe('parseQueryString', () => {
    it('creates params object from given query string', () => {
      expect(parseQueryString('foo=bar&baz=123&empty_value=&no_value')).toEqual(
        {
          foo: 'bar',
          baz: '123',
          empty_value: '',
          no_value: undefined,
        }
      );
    });
  });

  describe('serializeParams', () => {
    it('creates query string from given params object', () => {
      expect(
        serializeParams({
          foo: 'bar',
          baz: '123',
          empty_value: '',
          no_value: undefined,
        })
      ).toBe('foo=bar&baz=123&empty_value=&no_value');
    });
  });
});
