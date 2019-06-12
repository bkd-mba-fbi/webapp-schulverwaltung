import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { nonZero } from '../utils/filter';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount$ = new BehaviorSubject(0);
  loading$ = this.loadingCount$.pipe(map(nonZero));

  load<T>(source$: Observable<T>): Observable<T> {
    this.incrementLoadingCount();
    return source$.pipe(
      tap(() => this.decrementLoadingCount()),
      catchError(error => {
        this.decrementLoadingCount();
        return throwError(error);
      })
    );
  }

  private incrementLoadingCount(): void {
    this.loadingCount$.next(this.loadingCount$.value + 1);
  }

  private decrementLoadingCount(): void {
    this.loadingCount$.next(Math.max(this.loadingCount$.value - 1, 0));
  }
}
