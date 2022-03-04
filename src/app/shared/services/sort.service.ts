import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, distinctUntilChanged, shareReplay, take } from 'rxjs';
export interface Sorting<T> {
  key: keyof T;
  ascending: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SortService<T> {
  private sortingSubject$ = new BehaviorSubject<Option<Sorting<T>>>(null);

  sorting$ = this.sortingSubject$.asObservable().pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sorting changes
    shareReplay(1)
  );

  constructor() {}

  setSorting(sorting: Option<Sorting<T>>): void {
    this.sortingSubject$.next(sorting);
  }

  toggleSorting(key: keyof T): void {
    this.sorting$.pipe(take(1)).subscribe((sorting) => {
      if (sorting && sorting.key === key) {
        this.sortingSubject$.next({ key, ascending: !sorting.ascending });
      } else {
        this.sortingSubject$.next({ key, ascending: true });
      }
    });
  }
}
