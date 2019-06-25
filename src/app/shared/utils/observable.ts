import { HttpErrorResponse } from '@angular/common/http';
import {
  ObservableInput,
  ObservedValueOf,
  of,
  OperatorFunction,
  throwError,
  MonoTypeOperatorFunction
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export function catch404AsNull<
  T,
  O extends ObservableInput<any>
>(): OperatorFunction<T, Option<T | ObservedValueOf<O>>> {
  return catchError(error => {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return of(null);
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
