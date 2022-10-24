import * as t from 'io-ts';
import { either } from 'fp-ts/es6/Either';
import { JsonFromString } from 'io-ts-types';
import {
  parseISOLocalDateTime,
  formatISOLocalDateTime,
  parseISOLocalDate,
  formatISOLocalDate,
} from '../utils/date';

export function Option<T extends t.Any>(
  optionalType: T
): t.UnionC<[t.NullC, T]> {
  return t.union([t.null, optionalType]);
}

export function Maybe<T extends t.Any>(
  maybeType: T
): t.UnionC<[t.NullC, t.UndefinedC, T]> {
  return t.union([t.null, t.undefined, maybeType]);
}

const Reference = t.type({ Id: t.number, HRef: Option(t.string) });
type Reference = t.TypeOf<typeof Reference>;
export { Reference };

const OptionalReference = t.type({
  Id: Option(t.number),
  HRef: Option(t.string),
});
type OptionalReference = t.TypeOf<typeof OptionalReference>;
export { OptionalReference };

export const JsonFromUnknown = t.string.pipe(JsonFromString, 'JsonFromUnknown');

export const LocalDateTimeFromString = new t.Type<Date, string, unknown>(
  'LocalDateTimeFromString',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = parseISOLocalDateTime(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => formatISOLocalDateTime(a)
);

export const LocalDateFromString = new t.Type<Date, string, unknown>(
  'LocalDateTimeFromString',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = parseISOLocalDate(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => formatISOLocalDate(a)
);
