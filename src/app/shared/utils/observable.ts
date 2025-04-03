import { HttpErrorResponse } from "@angular/common/http";
import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  defer,
  from,
  fromEvent,
  interval,
  merge,
  of,
  throwError,
} from "rxjs";
import {
  catchError,
  defaultIfEmpty,
  map,
  mergeMap,
  startWith,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from "rxjs/operators";

export function catch404<T>(): OperatorFunction<T, Option<T>>;
export function catch404<T, R>(fallbackValue?: R): OperatorFunction<T, T | R>;
export function catch404<T, R>(
  fallbackValue?: R,
): OperatorFunction<T, Option<T | R>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return catchError((error: any) => {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      if (fallbackValue === undefined) {
        return of(null);
      } else {
        return of(fallbackValue);
      }
    }
    return throwError(() => error);
  });
}

/**
 * For debugging purposes, logs message an value for each value in the
 * stream, e.g.:
 *   foo$.pipe(log('foo$')).subscribe()
 */
export function log<T>(
  message: Option<string> = null,
): MonoTypeOperatorFunction<T> {
  return (input$) =>
    input$.pipe(
      tap((x: T) => (message ? console.log(message, x) : console.log(x))),
    );
}

/**
 * Calls a callback when an observable gets subscribed, e.g.:
 *   foo$.pipe(prepare(() => console.log('subscribed')))
 */
export function prepare<T>(
  callback: () => void,
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
  defaultValue: T,
): OperatorFunction<Maybe<T>, T> {
  return ($input) =>
    $input.pipe(
      map((value) => (value == null ? defaultValue : value)),
      defaultIfEmpty(defaultValue),
    );
}

/**
 * Returns an Observable that emits values of `source$`, or it
 * emits the last (cached) value of `source$` when `trigger$` emits.
 */
export function reemitOnTrigger<T>(
  source$: Observable<T>,
  trigger$: Observable<unknown>,
): Observable<T> {
  return source$.pipe(
    switchMap((value) =>
      trigger$.pipe(
        startWith(value),
        map(() => value),
      ),
    ),
  );
}

/**
 * Returns an Observable that emits every specified interval of time
 * within periods of inactivity (i.e. no mouse clicks or key presses).
 */
export function intervalOnInactivity(
  period: number,
  eventSource: Node = window.document,
) {
  return merge(
    ...["click", "keydown"].map((type) => fromEvent(eventSource, type)),
  ).pipe(
    startWith(null),
    switchMap(() => interval(period)),
    map(() => undefined),
  );
}

/**
 * Returns an observable that emits whenever `source$` emits and when `reload$`
 * emits, it emits the last value of `source$`.
 */
export function withReload<T>(
  source$: Observable<T>,
  reload$: Observable<unknown>,
): Observable<T> {
  return merge(
    source$,
    reload$.pipe(
      withLatestFrom(source$),
      map(([_, v]) => v),
    ),
  );
}

export function executeWithMaxConcurrency<T, R>(
  params: ReadonlyArray<T>,
  fn: (param: T) => Observable<R>,
  maxConcurrent = 20,
): Observable<ReadonlyArray<R>> {
  return from(params).pipe(
    mergeMap((param) => fn(param), maxConcurrent),
    toArray(), // Wait until all inner observables complete & merge result into an array
  );
}
