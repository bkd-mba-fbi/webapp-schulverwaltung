import { Injectable } from "@angular/core";
import { isEqual } from "lodash-es";
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  map,
  shareReplay,
  take,
} from "rxjs";

export interface Sorting<SortingKey> {
  key: SortingKey;
  ascending: boolean;
}

@Injectable({
  providedIn: "root",
})
export class SortService<SortingKey> {
  private sortingSubject$ = new BehaviorSubject<Option<Sorting<SortingKey>>>(
    null,
  );

  sorting$ = this.sortingSubject$.asObservable().pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sorting changes
    shareReplay(1),
  );

  getSortingChar$(key: SortingKey): Observable<string> {
    return this.sorting$.pipe(
      map((sorting) => {
        if (sorting && key === sorting.key) {
          return sorting.ascending ? "↓" : "↑";
        }
        return "";
      }),
    );
  }

  constructor() {}

  setSorting(sorting: Option<Sorting<SortingKey>>): void {
    this.sortingSubject$.next(sorting);
  }

  toggleSorting(key: SortingKey): void {
    this.sorting$.pipe(take(1)).subscribe((sorting) => {
      const ascending =
        sorting && sorting.key === key ? !sorting.ascending : true;
      this.sortingSubject$.next({ key, ascending });
    });
  }
}
