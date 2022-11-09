import { HttpErrorResponse } from '@angular/common/http';
import {
  ObservableInput,
  ObservedValueOf,
  of,
  OperatorFunction,
  throwError,
  MonoTypeOperatorFunction,
  Observable,
  defer,
  fromEvent,
  interval,
  merge,
} from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  tap,
  map,
  switchMap,
  startWith,
} from 'rxjs/operators';

export function catch404<T, O extends ObservableInput<any>>(
  returnValue?: any
): OperatorFunction<T, Option<T | ObservedValueOf<O>>> {
  return catchError((error) => {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return of(returnValue || null);
    } else {
      return throwError(() => error);
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
  return (input$) =>
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

/**
 * Converts emitted values to `defaultValue` if `undefined` or
 * `null`. Also emits `defaultValue` if source Observable completes
 * without having emitted any value.
 */
export function defaultValue<T>(
  defaultValue: T
): OperatorFunction<Maybe<T>, T> {
  return ($input) =>
    $input.pipe(
      map((value) => (value == null ? defaultValue : value)),
      defaultIfEmpty(defaultValue)
    );
}

/**
 * Returns an Observable that emits values of `source$`, or it
 * emits the last (cached) value of `source$` when `trigger$` emits.
 */
export function reemitOnTrigger<T>(
  source$: Observable<T>,
  trigger$: Observable<unknown>
): Observable<T> {
  return source$.pipe(
    switchMap((value) =>
      trigger$.pipe(
        startWith(value),
        map(() => value)
      )
    )
  );
}

/**
 * Returns an Observable that emits every specified interval of time
 * within periods of inactivity (i.e. no mouse clicks or key presses).
 */
export function intervalOnInactivity(
  period: number,
  eventSource: Node = window.document
) {
  return merge(
    ...['click', 'keydown'].map((type) => fromEvent(eventSource, type))
  ).pipe(
    startWith(null),
    switchMap(() => interval(period)),
    map(() => undefined)
  );
}
