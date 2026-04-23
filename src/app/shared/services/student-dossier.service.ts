import { Injectable, inject } from "@angular/core";
import { Observable, combineLatest, map, shareReplay, switchMap } from "rxjs";
import { SETTINGS, Settings } from "../../settings";
import { AdditionalInformation } from "../models/additional-informations.model";
import { DropDownItem } from "../models/drop-down-item.model";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { LoadingService } from "./loading-service";
import { StorageService } from "./storage.service";
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
  isOwner: boolean;
}

const STUDENT_DOSSIER_CONTEXT = "student-dossier";

@Injectable({
  providedIn: "root",
})
export class StudentDossierService {
  private settings = inject<Settings>(SETTINGS);
  private state = inject(StudentStateService);
  private loadingService = inject(LoadingService);
  private studentsService = inject(StudentsRestService);
  private dropDownItemsService = inject(DropDownItemsRestService);
  private storageService = inject(StorageService);

  loading$ = this.loadingService.loading(STUDENT_DOSSIER_CONTEXT);
  studentId$ = this.state.studentId$;
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
      infos
        .filter((info) => info.CodeId != null)
        .map((info) => this.buildEntry(info, categories)),
    ),
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
  );

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
        .pipe(map((entries) => [...entries].sort(this.sortByDateDesc))),
      { context: STUDENT_DOSSIER_CONTEXT },
    );
  }

  private loadCategories(): Observable<ReadonlyArray<DropDownItem>> {
    return this.loadingService.load(
      this.dropDownItemsService.getAdditionalInformationCodes(),
      {
        context: STUDENT_DOSSIER_CONTEXT,
      },
    );
  }

  private buildEntry(
    info: AdditionalInformation,
    categories: ReadonlyArray<DropDownItem>,
  ): StudentDossierEntry {
    const codeId = info.CodeId;

    return {
      id: info.Id,
      type: this.getEntryType(info),
      additionalInformation: info,
      category: codeId
        ? (categories.find((c) => String(c.Key) === String(codeId))?.Value ??
          null)
        : null,
      isOwner: this.isOwner(info),
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
