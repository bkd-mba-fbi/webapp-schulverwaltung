import * as t from 'io-ts';
import { pipe } from 'fp-ts/es6/function';
import { fold, left } from 'fp-ts/es6/Either';
import { PathReporter } from 'io-ts/es6/PathReporter';
import { Observable, throwError, of } from 'rxjs';

export class DecodeError extends Error {
  name = 'DecodeError';
}

/**
 * Decode JSON data using the given io-st type (i.e. codec), throws a
 * `DecodeError` if the data is not valid.
 *
 * Usage:
 *   const Foo = t.type({
 *     foo: t.string
 *   });
 *   decode(Foo)({ foo: 'bar' }).subscribe(result => ...)
 *
 * Example using HttpClient:
 *   this.http.get(...).pipe(switchMap(decode(Foo))).subscribe(...)
 */
export function decode<C extends t.Mixed>(
  codec: C,
): (json: unknown) => Observable<t.TypeOf<C>> {
  return (json) => {
    return pipe(
      codec.decode(json),
      fold(
        (error) =>
          throwError(
            () => new DecodeError(PathReporter.report(left(error)).join('\n')),
          ),
        (data) => of(data),
      ),
    );
  };
}

/**
 * Convenience function, equivalent to calling `decode(t.array(X))`,
 * but without having to import io-ts: `decodeArray(X)`.
 */
export function decodeArray<C extends t.Mixed>(
  codec: C,
): (json: unknown) => Observable<ReadonlyArray<t.TypeOf<C>>> {
  return decode(t.array(codec));
}
