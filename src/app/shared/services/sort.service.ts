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
import { SortCriteria } from "../utils/sort";

@Injectable({
  providedIn: "root",
})
export class SortService<SortingKey> {
  private sortingSubject$ = new BehaviorSubject<
    Option<SortCriteria<SortingKey>>
  >(null);

  sorting$ = this.sortingSubject$.asObservable().pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sorting changes
    shareReplay(1),
  );

  getSortingChar$(primarySortKey: SortingKey): Observable<string> {
    return this.sorting$.pipe(
      map((sorting) => {
        if (sorting && primarySortKey === sorting.primarySortKey) {
          return sorting.ascending ? "↓" : "↑";
        }
        return "";
      }),
    );
  }

  constructor() {}

  setSorting(sorting: Option<SortCriteria<SortingKey>>): void {
    this.sortingSubject$.next(sorting);
  }

  toggleSorting(primarySortKey: SortingKey): void {
    this.sorting$.pipe(take(1)).subscribe((sorting) => {
      const ascending =
        sorting && sorting.primarySortKey === primarySortKey
          ? !sorting.ascending
          : true;
      this.sortingSubject$.next({ primarySortKey: primarySortKey, ascending });
    });
  }
}
