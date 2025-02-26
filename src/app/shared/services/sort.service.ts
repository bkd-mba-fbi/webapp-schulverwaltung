import { Injectable } from "@angular/core";
import { isEqual } from "lodash-es";
import { BehaviorSubject, distinctUntilChanged, shareReplay } from "rxjs";
import {
  SortCriteria,
  SortKey,
} from "../components/sortable-header/sortable-header.component";

@Injectable({
  providedIn: "root",
})
export class SortService<TPrimarySortKey extends SortKey> {
  private sortingSubject$ = new BehaviorSubject<
    Option<SortCriteria<TPrimarySortKey>>
  >(null);

  sorting$ = this.sortingSubject$.asObservable().pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sorting changes
    shareReplay(1),
  );

  constructor() {}

  setSorting(sorting: Option<SortCriteria<TPrimarySortKey>>): void {
    this.sortingSubject$.next(sorting);
  }
}
