import { HttpErrorResponse } from '@angular/common/http';
import {
  ObservableInput,
  ObservedValueOf,
  of,
  OperatorFunction,
  throwError,
  MonoTypeOperatorFunction,
  Observable,
  defer
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export function catch404<T, O extends ObservableInput<any>>(
  returnValue?: any
): OperatorFunction<T, Option<T | ObservedValueOf<O>>> {
  return catchError(error => {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return of(returnValue || null);
    } else {
      return throwError(error);
    }
  });
}

/**
 * For debugging purposes, logs message an value for each value in the
 * stream, e.g.:
 *   foo$.pipe(log('foo$')).subscribe()
 */
export function log<T>(
  message: Option<string> = null
): MonoTypeOperatorFunction<T> {
  return input$ =>
    input$.pipe(
      tap((x: T) => (message ? console.log(message, x) : console.log(x)))
    );
}

/**
 * Calls a callback when an observable gets subscribed, e.g.:
 *   foo$.pipe(prepare(() => console.log('subscribed')))
 */
export function prepare<T>(
  callback: () => void
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}
