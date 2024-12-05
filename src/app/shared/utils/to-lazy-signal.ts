/**
 * MIT-licensed, from the ngxtension project, see
 * https://ngxtension.netlify.app/utilities/signals/to-lazy-signal/ and
 * https://github.com/ngxtension/ngxtension-platform/blob/main/libs/ngxtension/to-lazy-signal/src/to-lazy-signal.ts
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal, computed, untracked } from "@angular/core";
import { type ToSignalOptions, toSignal } from "@angular/core/rxjs-interop";
import type { Observable, Subscribable } from "rxjs";
import { assertInjector } from "./assert-injector";

type ReturnType<T, U> = (T | U) | (T | undefined) | (T | null) | T;

export function toLazySignal<T>(
  source: Observable<T> | Subscribable<T>,
): Signal<T | undefined>;

export function toLazySignal<T>(
  source: Observable<T> | Subscribable<T>,
  options: ToSignalOptions<T> & {
    initialValue?: undefined;
    requireSync?: false;
  },
): Signal<T | undefined>;

export function toLazySignal<T>(
  source: Observable<T> | Subscribable<T>,
  options: ToSignalOptions<T> & { initialValue?: null; requireSync?: false },
): Signal<T | null>;

export function toLazySignal<T>(
  source: Observable<T> | Subscribable<T>,
  options: ToSignalOptions<T> & { initialValue?: undefined; requireSync: true },
): Signal<T>;

export function toLazySignal<T, const U extends T>(
  source: Observable<T> | Subscribable<T>,
  options: ToSignalOptions<T> & { initialValue: U; requireSync?: false },
): Signal<T | U>;

/**
 * Function `toLazySignal()` is a proxy function that will call the original
 * `toSignal()` function when the returned signal is read for the first time.
 */
export function toLazySignal<T, U = undefined>(
  source: Observable<T> | Subscribable<T>,
  options?: ToSignalOptions<T> & { initialValue?: U },
): Signal<ReturnType<T, U>> {
  const injector = assertInjector(toLazySignal, options?.injector);
  let s: Signal<ReturnType<T, U>>;

  return computed<ReturnType<T, U>>(() => {
    if (!s) {
      s = untracked(() => toSignal(source, { ...options, injector } as any));
    }
    return s();
  });
}
