import { Injectable, OnDestroy, inject } from "@angular/core";
import {
  Observable,
  Subject,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import {
  AdditionalInformation,
  AdditionalInformationCode,
} from "../models/additional-informations.model";
import { isAllowedDossierCategory } from "../utils/additional-informations";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { LoadingService } from "./loading-service";
import { StorageService } from "./storage.service";
import { StudentDossierFilterService } from "./student-dossier-filter.service";
import { StudentStateService } from "./student-state.service";
import { StudentsRestService } from "./students-rest.service";

export type StudentDossierEntryType =
  | "information"
  | "disadvantage"
  | "dossier";

export interface StudentDossierEntry {
  id: number;
  type: StudentDossierEntryType;
  additionalInformation: AdditionalInformation;
  category: Option<string>;
  canEdit: boolean;
}

const STUDENT_DOSSIER_CONTEXT = "student-dossier";

@Injectable({
  providedIn: "root",
})
export class StudentDossierService implements OnDestroy {
  private settings = inject<Settings>(SETTINGS);
  private state = inject(StudentStateService);
  private loadingService = inject(LoadingService);
  private studentsService = inject(StudentsRestService);
  private dropDownItemsService = inject(DropDownItemsRestService);
  private storageService = inject(StorageService);
  private filterService = inject(StudentDossierFilterService);

  loading$ = this.loadingService.loading(STUDENT_DOSSIER_CONTEXT);
  studentId$ = this.state.studentId$;

  private destroy$ = new Subject<void>();
  private additionalInformations$ = this.studentId$.pipe(
    switchMap((studentId) => this.loadAdditionalInformations(studentId)),
    shareReplay(1),
  );
  private categories$ = this.loadCategories();

  entries$ = combineLatest([
    this.additionalInformations$,
    this.categories$,
  ]).pipe(
    map(([infos, categories]) =>
      infos.map((info) => this.buildEntry(info, categories)),
    ),
    startWith([]),
    shareReplay(1),
  );
  informationEntries$ = this.entries$.pipe(
    map((entries) => entries.filter((entry) => entry.type === "information")),
  );
  disadvantageEntries$ = this.entries$.pipe(
    map((entries) => entries.filter((entry) => entry.type === "disadvantage")),
  );
  dossierEntries$ = this.entries$.pipe(
    map((entries) => entries.filter((entry) => entry.type === "dossier")),
    shareReplay(1),
  );
  filteredDossierEntries$ = combineLatest([
    this.dossierEntries$,
    this.filterService.selectedCategories$,
  ]).pipe(
    map(([entries, selected]) =>
      selected.length === 0
        ? entries
        : entries.filter(
            (entry) =>
              entry.category != null && selected.includes(entry.category),
          ),
    ),
    shareReplay(1),
  );

  constructor() {
    this.dossierEntries$.pipe(takeUntil(this.destroy$)).subscribe((entries) => {
      this.filterService.setDossierEntries(entries);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private sortByDateDesc(
    a: AdditionalInformation,
    b: AdditionalInformation,
  ): number {
    return b.CreationDate.getTime() - a.CreationDate.getTime();
  }

  private loadAdditionalInformations(
    studentId: number,
  ): Observable<ReadonlyArray<AdditionalInformation>> {
    return this.loadingService.load(
      this.studentsService
        .getAdditionalInformations(studentId)
        .pipe(
          map((entries) =>
            entries
              .filter(
                (info) =>
                  this.settings.dossierEntriesTypeIds.includes(info.TypeId) &&
                  info.CodeId != null,
              )
              .sort(this.sortByDateDesc),
          ),
        ),
      { context: STUDENT_DOSSIER_CONTEXT },
    );
  }

  private loadCategories(): Observable<
    ReadonlyArray<AdditionalInformationCode>
  > {
    return this.loadingService.load(
      this.dropDownItemsService.getAdditionalInformationCodes(),
      {
        context: STUDENT_DOSSIER_CONTEXT,
      },
    );
  }

  private buildEntry(
    info: AdditionalInformation,
    categories: ReadonlyArray<AdditionalInformationCode>,
  ): StudentDossierEntry {
    const codeId = info.CodeId;
    const category = codeId
      ? (categories.find((c) => String(c.Key) === String(codeId)) ?? null)
      : null;
    const allowedCategory = Boolean(
      category && isAllowedDossierCategory(category, this.settings),
    );

    return {
      id: info.Id,
      type: this.getEntryType(info),
      additionalInformation: info,
      category: category?.Value ?? null,
      canEdit: this.isOwner(info) && allowedCategory, // The author of the entry can only edit it, if it has a category that is selectable in the frontend
    };
  }

  private getEntryType(entry: AdditionalInformation): StudentDossierEntryType {
    switch (entry.CodeId) {
      case this.settings.dossierImportantInformationCodeId:
        return "information";
      case this.settings.dossierDisadvantageCompensationCodeId:
        return "disadvantage";
      default:
        return "dossier";
    }
  }

  private isOwner(entry: AdditionalInformation): boolean {
    const token = this.storageService.getPayload();
    if (!token) {
      return false;
    }
    return entry.CreatorName === token.username;
  }
}
