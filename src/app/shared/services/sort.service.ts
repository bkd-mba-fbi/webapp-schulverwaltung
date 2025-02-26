import { Injectable } from "@angular/core";
import { isEqual } from "lodash-es";
import { BehaviorSubject, distinctUntilChanged, shareReplay } from "rxjs";
import { SortCriteria } from "../components/sortable-header/sortable-header.component";

@Injectable({
  providedIn: "root",
})
export class SortService<PrimarySortKey> {
  private sortingSubject$ = new BehaviorSubject<
    Option<SortCriteria<PrimarySortKey>>
  >(null);

  updateSortCriteria(newCriteria: SortCriteria<PrimarySortKey>): void {
    this.sortingSubject$.next(newCriteria);
  }

  sorting$ = this.sortingSubject$.asObservable().pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sorting changes
    shareReplay(1),
  );

  constructor() {}

  setSorting(sorting: Option<SortCriteria<PrimarySortKey>>): void {
    this.sortingSubject$.next(sorting);
  }
}
