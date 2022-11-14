import { Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  Subject,
  ReplaySubject,
  ConnectableObservable,
  Subscription,
} from 'rxjs';
import {
  map,
  finalize,
  scan,
  startWith,
  distinctUntilChanged,
  multicast,
} from 'rxjs/operators';
import { prepare } from '../utils/observable';

interface LoadingAction {
  action: 'increment' | 'decrement';
  context: string;
}

interface LoadingCounts {
  [context: string]: number;
}

const DEFAULT_CONTEXT = 'default';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements OnDestroy {
  private action$ = new Subject<LoadingAction>();
  private loadingCountsSub: Subscription;

  loadingCounts$ = this.action$.pipe(
    scan((counts, { action, context }) => {
      switch (action) {
        case 'increment':
          counts[context] = (counts[context] || 0) + 1;
          return counts;
        case 'decrement':
          counts[context] = Math.max(0, (counts[context] || 0) - 1);
          return counts;
        default:
          return counts;
      }
    }, {} as LoadingCounts),
    startWith({} as LoadingCounts),
    multicast(() => new ReplaySubject<LoadingCounts>(1)) // Make it hot
  );

  loading$ = this.loading();

  constructor() {
    this.loadingCountsSub = (
      this.loadingCounts$ as ConnectableObservable<LoadingCounts>
    ).connect();
  }

  ngOnDestroy(): void {
    this.loadingCountsSub.unsubscribe();
  }

  loading(context = DEFAULT_CONTEXT): Observable<boolean> {
    return this.loadingCounts$.pipe(
      map((counts) => counts[context]),
      map(nonZero),
      distinctUntilChanged()
    );
  }

  load<T>(source$: Observable<T>, context = DEFAULT_CONTEXT): Observable<T> {
    return source$.pipe(
      prepare(this.incrementLoadingCount(context)),
      finalize(this.decrementLoadingCount(context))
    );
  }

  private incrementLoadingCount(context: string): () => void {
    return () => this.action$.next({ action: 'increment', context });
  }

  private decrementLoadingCount(context: string): () => void {
    return () => this.action$.next({ action: 'decrement', context });
  }
}

function nonZero(value?: number): boolean {
  return (value || 0) !== 0;
}
