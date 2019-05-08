import * as t from 'io-ts/lib/index';
import { reporter } from 'io-ts-reporters';
import { Observable, throwError, of } from 'rxjs';

export class DecodeError extends Error {
  name = 'DecodeError';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Decode JSON data using the given io-st type (i.e. decoder), throws
 * a `DecodeError` if the data is not valid.
 *
 * Usage:
 *   const Foo = t.type({
 *     foo: t.string
 *   });
 *   decode(Foo)({ foo: 'bar' }).subscribe(result => ...)
 *
 * Example using HttpClient:
 *   this.http.get(...).pipe(switchMap(decode(decode(Foo)))).subscribe(...)
 */
export function decode<P extends t.AnyProps>(
  decoder: t.TypeC<P>
): (json: unknown) => Observable<t.TypeOfProps<P>> {
  return json => {
    const result = decoder.decode(json);
    return result.fold(
      () => throwError(new DecodeError(reporter(result).join('\n'))),
      r => of(r)
    );
  };
}

/**
 * Decode JSON array data using the given io-st type (i.e. decoder), throws
 * a `DecodeError` if the data is not valid.
 *
 * Usage:
 *   const Foo = t.type({
 *     foo: t.string
 *   });
 *   decode(Foo)([{ foo: 'bar' }]).subscribe(result => ...)
 *
 * Example using HttpClient:
 *   this.http.get(...).pipe(switchMap(decodeArray(decode(Foo)))).subscribe(...)
 */
export function decodeArray<P extends t.AnyProps>(
  decoder: t.TypeC<P>
): (json: unknown) => Observable<ReadonlyArray<t.TypeOfProps<P>>> {
  return json => {
    const result = t.array(decoder).decode(json);
    return result.fold(
      () => throwError(new DecodeError(reporter(result).join('\n'))),
      r => of(r)
    );
  };
}
