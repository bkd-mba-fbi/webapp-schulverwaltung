import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  map,
  finalize,
  scan,
  pluck,
  startWith,
  distinctUntilChanged,
  shareReplay
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
  providedIn: 'root'
})
export class LoadingService {
  private action$ = new Subject<LoadingAction>();
  loadingCounts$ = this.action$.pipe(
    scan(
      (counts, { action, context }) => {
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
      },
      {} as LoadingCounts
    ),
    startWith({} as LoadingCounts),
    shareReplay(1)
  );

  loading$ = this.loading();

  loading(context = DEFAULT_CONTEXT): Observable<boolean> {
    return this.loadingCounts$.pipe(
      pluck(context),
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
