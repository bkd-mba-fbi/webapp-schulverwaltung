import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { isEqual } from "lodash-es";
import { Observable, distinctUntilChanged, shareReplay } from "rxjs";
import {
  SortCriteria,
  SortKey,
} from "../components/sortable-header/sortable-header.component";

@Injectable({
  providedIn: "root",
})
export class SortService<TSortKey extends SortKey> {
  sortCriteria = signal<Option<SortCriteria<TSortKey>>>(null);

  sortCriteria$: Observable<Option<SortCriteria<TSortKey>>> = toObservable(
    this.sortCriteria,
  ).pipe(
    distinctUntilChanged(isEqual), // Only cause a reload if the sortCriteria changes
    shareReplay(1),
  );
}
