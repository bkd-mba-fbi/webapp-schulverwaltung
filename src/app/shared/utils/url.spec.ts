import { getFirstSegment, parseQueryString, serializeParams } from './url';

describe('url utilities', () => {
  describe('parseQueryString', () => {
    it('creates params object from given query string', () => {
      expect(parseQueryString('foo=bar&baz=123&empty_value=&no_value')).toEqual(
        {
          foo: 'bar',
          baz: '123',
          empty_value: '',
          no_value: undefined,
        },
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
        }),
      ).toBe('foo=bar&baz=123&empty_value=&no_value');
    });
  });

  describe('getFirstSegment', () => {
    it('should get the first element of url with one segment', () => {
      expect(getFirstSegment('/presence-control')).toBe('presence-control');
    });
    it('should get the first element of url with multiple segments', () => {
      expect(getFirstSegment('/presence-control/student/3')).toBe(
        'presence-control',
      );
    });
    it('should get the first element of url with params', () => {
      expect(getFirstSegment('/presence-control?date=2020-02-20')).toBe(
        'presence-control',
      );
    });
    it('should get the first element of root url', () => {
      expect(getFirstSegment('/')).toBe(null);
    });
  });
});
