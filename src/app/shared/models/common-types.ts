import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';
import { parseISOLocal, formatISOLocal } from '../utils/date';

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
  HRef: Option(t.string)
});
type OptionalReference = t.TypeOf<typeof OptionalReference>;
export { OptionalReference };

export const Gender = new t.Type<'M' | 'F', 'M' | 'F' | 1 | 2>(
  'Gender',
  (u): u is 'M' | 'F' => u === 'M' || u === 'F',
  (u, c) =>
    either.chain(
      t
        .union([t.literal('M'), t.literal('F'), t.literal(1), t.literal(2)])
        .validate(u, c),
      v => {
        if (v === 'M' || v === 'F') {
          return t.success(v);
        }
        if (v === 1) {
          return t.success('M');
        }
        if (v === 2) {
          return t.success('F');
        }
        return t.failure(u, c);
      }
    ),
  a => a
);

export const DateFromString = new t.Type<Date, string, unknown>(
  'DateFromString',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      const d = parseISOLocal(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  a => formatISOLocal(a)
);
