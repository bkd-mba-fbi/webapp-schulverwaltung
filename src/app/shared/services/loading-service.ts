import { Injectable, OnDestroy } from "@angular/core";
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  connectable,
  defer,
  identity,
} from "rxjs";
import {
  distinctUntilChanged,
  finalize,
  map,
  scan,
  startWith,
  tap,
} from "rxjs/operators";

interface LoadingAction {
  action: "increment" | "decrement";
  context: string;
}

interface LoadingCounts {
  [context: string]: number;
}

const DEFAULT_CONTEXT = "default";

@Injectable({
  providedIn: "root",
})
export class LoadingService implements OnDestroy {
  private action$ = new Subject<LoadingAction>();
  private loadingCountsSub: Subscription;

  loadingCounts$ = connectable(
    this.action$.pipe(
      scan((counts, { action, context }) => {
        switch (action) {
          case "increment":
            counts[context] = (counts[context] || 0) + 1;
            return counts;
          case "decrement":
            counts[context] = Math.max(0, (counts[context] || 0) - 1);
            return counts;
          default:
            return counts;
        }
      }, {} as LoadingCounts),
      startWith({} as LoadingCounts),
    ),
    { connector: () => new ReplaySubject<LoadingCounts>(1) }, // Make it hot
  );

  loading$ = this.loading();

  constructor() {
    this.loadingCountsSub = this.loadingCounts$.connect();
  }

  ngOnDestroy(): void {
    this.loadingCountsSub.unsubscribe();
  }

  /**
   * Returns an observable that returns the loading state of the given context.
   */
  loading(context = DEFAULT_CONTEXT): Observable<boolean> {
    return this.loadingCounts$.pipe(
      map((counts) => counts[context]),
      map(nonZero),
      distinctUntilChanged(),
    );
  }

  /**
   * Wrap your observable with this function to update the loading state. With
   * the option `stopOnFirstValue` enabled, the loading state will be set to
   * `false` once the observable emits the first value. Per default the loading
   * state will be set to `false` once the observable completes.
   */
  load<T>(
    source$: Observable<T>,
    options:
      | string // context
      | { context?: string; stopOnFirstValue?: boolean } = DEFAULT_CONTEXT,
  ): Observable<T> {
    const context =
      typeof options === "string"
        ? options
        : options.context || DEFAULT_CONTEXT;
    const stopOnFirstValue =
      (typeof options === "object" && options.stopOnFirstValue) || false;

    const increment = this.incrementLoadingCount(context);
    const decrement = this.decrementLoadingCount(context);

    return defer(() => {
      let firstValue = false;
      const decrementOnce = () => {
        if (!firstValue) {
          firstValue = true;
          decrement();
        }
      };

      increment();
      return source$.pipe(
        stopOnFirstValue ? tap(decrementOnce) : identity,
        finalize(decrementOnce),
      );
    });
  }

  private incrementLoadingCount(context: string): () => void {
    return () => this.action$.next({ action: "increment", context });
  }

  private decrementLoadingCount(context: string): () => void {
    return () => this.action$.next({ action: "decrement", context });
  }
}

function nonZero(value?: number): boolean {
  return (value || 0) !== 0;
}
