import { Injectable } from "@angular/core";
import { uniqBy } from "lodash-es";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  map,
  shareReplay,
  switchMap,
} from "rxjs";
import { DropDownGroupedItem } from "../models/drop-down-grouped-item.model";
import { StudentDossierEntry } from "./student-dossier.service";

@Injectable()
export class StudentDossierFilterService {
  private dossierEntriesSource$ = new ReplaySubject<
    Observable<ReadonlyArray<StudentDossierEntry>>
  >(1);
  private dossierEntries$ = this.dossierEntriesSource$.pipe(
    switchMap((entries$) => entries$),
    shareReplay(1),
  );

  private selectedCategoriesSubject$ = new BehaviorSubject<
    ReadonlyArray<string>
  >([]);
  selectedCategories$ = this.selectedCategoriesSubject$.asObservable();
  isFilterActive$ = this.selectedCategoriesSubject$.pipe(
    map((selected) => selected.length > 0),
  );

  filterOptions$ = this.dossierEntries$.pipe(
    map((entries) =>
      uniqBy(this.buildFilterOptions(entries), "Value").sort((a, b) =>
        a.Value.localeCompare(b.Value),
      ),
    ),
    shareReplay(1),
  );

  setDossierEntries(
    entries$: Observable<ReadonlyArray<StudentDossierEntry>>,
  ): void {
    this.dossierEntriesSource$.next(entries$);
  }

  setSelectedCategories(categories: ReadonlyArray<string>): void {
    this.selectedCategoriesSubject$.next(categories);
  }

  private buildFilterOptions(
    entries: ReadonlyArray<StudentDossierEntry>,
  ): ReadonlyArray<DropDownGroupedItem> {
    return entries
      .filter(
        (entry) =>
          entry.category != null && entry.additionalInformation.CodeId != null,
      )
      .map((entry) => ({
        Value: entry.category as string,
        Key: entry.additionalInformation.CodeId as number,
        Group: "shared.multiselect.all-option",
      }));
  }
}
