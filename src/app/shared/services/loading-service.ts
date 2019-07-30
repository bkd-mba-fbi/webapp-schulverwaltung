import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { nonZero } from '../utils/filter';
import { prepare } from '../utils/observable';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount$ = new BehaviorSubject(0);
  loading$ = this.loadingCount$.pipe(map(nonZero));

  load<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      prepare(this.incrementLoadingCount.bind(this)),
      finalize(this.decrementLoadingCount.bind(this))
    );
  }

  private incrementLoadingCount(): void {
    this.loadingCount$.next(this.loadingCount$.value + 1);
  }

  private decrementLoadingCount(): void {
    this.loadingCount$.next(Math.max(this.loadingCount$.value - 1, 0));
  }
}
