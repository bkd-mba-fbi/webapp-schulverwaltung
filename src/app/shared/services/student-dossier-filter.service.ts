import { Injectable } from "@angular/core";
import { uniqBy } from "lodash-es";
import { BehaviorSubject, map, shareReplay } from "rxjs";
import { DropDownGroupedItem } from "../models/drop-down-grouped-item.model";
import { StudentDossierEntry } from "./student-dossier.service";

@Injectable()
export class StudentDossierFilterService {
  private dossierEntriesSubject$ = new BehaviorSubject<
    ReadonlyArray<StudentDossierEntry>
  >([]);
  private selectedCategoriesSubject$ = new BehaviorSubject<
    ReadonlyArray<string>
  >([]);

  selectedCategories$ = this.selectedCategoriesSubject$.asObservable();
  isFilterActive$ = this.selectedCategoriesSubject$.pipe(
    map((selected) => selected.length > 0),
  );
  filterOptions$ = this.dossierEntriesSubject$.pipe(
    map((entries) =>
      uniqBy(this.buildFilterOptions(entries), "Value").sort((a, b) =>
        a.Value.localeCompare(b.Value),
      ),
    ),
    shareReplay(1),
  );

  setDossierEntries(entries: ReadonlyArray<StudentDossierEntry>): void {
    this.dossierEntriesSubject$.next(entries);
    this.selectedCategoriesSubject$.next([]);
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
