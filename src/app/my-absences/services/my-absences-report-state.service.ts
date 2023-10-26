import { Inject, Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";
import { combineLatest, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { addDays, format, subDays } from "date-fns";

import { SETTINGS, Settings } from "src/app/settings";
import {
  PAGE_LOADING_CONTEXT,
  PaginatedEntriesService,
} from "src/app/shared/services/paginated-entries.service";
import { Paginated } from "src/app/shared/utils/pagination";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { LoadingService } from "src/app/shared/services/loading-service";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import { LessonAbsence } from "src/app/shared/models/lesson-absence.model";
import { LessonDispensation } from "src/app/shared/models/lesson-dispensation.model";
import { OptionalReference } from "src/app/shared/models/common-types";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { SortService } from "src/app/shared/services/sort.service";

export interface ReportAbsencesFilter {
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
}

@Injectable()
export class MyAbsencesReportStateService extends PaginatedEntriesService<
  LessonPresence,
  ReportAbsencesFilter
> {
  private preventAbsencesAfterStart = false;

  constructor(
    location: Location,
    loadingService: LoadingService,
    @Inject(SETTINGS) settings: Settings,
    private studentsService: StudentsRestService,
    private storageService: StorageService,
    sortService: SortService<keyof LessonPresence>,
  ) {
    super(
      location,
      loadingService,
      sortService,
      settings,
      "/my-absences/report",
    );

    const currentInstanceId = this.storageService.getPayload()?.instance_id;
    const instanceIds = this.settings.preventStudentAbsenceAfterLessonStart;
    this.preventAbsencesAfterStart = currentInstanceId
      ? instanceIds.includes(currentInstanceId)
      : false;
  }

  protected getInitialFilter(): ReportAbsencesFilter {
    return {
      dateFrom: null,
      dateTo: null,
    };
  }

  protected isValidFilter(filterValue: ReportAbsencesFilter): boolean {
    return Boolean(filterValue.dateFrom || filterValue.dateTo);
  }

  protected loadEntries(
    filterValue: ReportAbsencesFilter,
    _sorting: null,
    _offset: number,
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    const params = this.buildRequestParamsFromFilter(filterValue).set(
      "sort",
      "From.asc",
    );
    return this.loadingService.load(
      this.loadTimetableEntries(params).pipe(
        map((entries) => this.filterAbsencesAfterLessonStart(entries)),
        switchMap((entries) =>
          combineLatest([
            of(entries),
            this.loadLessonAbsences(entries),
            this.loadLessonDispensations(entries),
          ]),
        ),
        map(([entries, absences, dispensations]) =>
          this.buildLessonPresences(entries, absences, dispensations),
        ),
        // Pagination is ignored
        map((entries) => ({ offset: 0, total: entries.length, entries })),
      ),
      PAGE_LOADING_CONTEXT,
    );
  }

  private filterAbsencesAfterLessonStart(
    entries: ReadonlyArray<TimetableEntry>,
  ): ReadonlyArray<TimetableEntry> {
    return this.preventAbsencesAfterStart
      ? entries.filter((entry) => entry.From >= new Date())
      : entries;
  }

  protected buildParamsFromFilter(filterValue: ReportAbsencesFilter): Params {
    const { dateFrom, dateTo } = filterValue;
    const params: Params = {};
    if (dateFrom) {
      params.dateFrom = format(dateFrom, "yyyy-MM-dd");
    }
    if (dateTo) {
      params.dateTo = format(dateTo, "yyyy-MM-dd");
    }
    return params;
  }

  private buildRequestParamsFromFilter(
    filterValue: ReportAbsencesFilter,
  ): HttpParams {
    let params = new HttpParams();
    if (filterValue.dateFrom) {
      params = params.set(
        "filter.From",
        `>${format(subDays(filterValue.dateFrom, 1), "yyyy-MM-dd")}`,
      );
    }
    if (filterValue.dateTo) {
      params = params.set(
        "filter.To",
        `<${format(addDays(filterValue.dateTo, 1), "yyyy-MM-dd")}`,
      );
    }
    return params;
  }

  private get studentId(): number {
    const id = this.storageService.getPayload()?.id_person;
    if (id == null) {
      throw new Error("No student id available");
    }
    return Number(id);
  }

  private loadTimetableEntries(
    params: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<TimetableEntry>> {
    return this.studentsService.getTimetableEntries(this.studentId, params);
  }

  private loadLessonAbsences(
    timetableEntries: ReadonlyArray<TimetableEntry>,
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return timetableEntries.length > 0
      ? this.studentsService.getLessonAbsences(this.studentId, {
          "filter.Id": `;${timetableEntries.map((e) => e.Id).join(";")}`,
        })
      : of([]);
  }

  private loadLessonDispensations(
    timetableEntries: ReadonlyArray<TimetableEntry>,
  ): Observable<ReadonlyArray<LessonDispensation>> {
    return timetableEntries.length > 0
      ? this.studentsService.getLessonDispensations(this.studentId, {
          "filter.Id": `;${timetableEntries.map((e) => e.Id).join(";")}`,
        })
      : of([]);
  }

  private buildLessonPresences(
    timetableEntries: ReadonlyArray<TimetableEntry>,
    absences: ReadonlyArray<LessonAbsence>,
    dispensations: ReadonlyArray<LessonDispensation>,
  ): ReadonlyArray<LessonPresence> {
    return timetableEntries.map((entry) =>
      this.buildLessonPresence(entry, absences, dispensations),
    );
  }

  private buildLessonPresence(
    timetableEntry: TimetableEntry,
    absences: ReadonlyArray<LessonAbsence>,
    dispensations: ReadonlyArray<LessonDispensation>,
  ): LessonPresence {
    const absence = absences.find((a) => a.LessonRef.Id === timetableEntry.Id);
    const dispensation = dispensations.find(
      (d) => d.LessonRef.Id === timetableEntry.Id,
    );
    const typeRef = this.buildLessonPresenceTypeRef(absence, dispensation);
    return {
      Id: "",
      LessonRef: { Id: timetableEntry.Id, HRef: null },
      StudentRef: (absence || dispensation)?.StudentRef || {
        Id: this.studentId,
        HRef: null,
      },
      EventRef: { Id: 0, HRef: null },
      TypeRef: typeRef,
      RegistrationRef: { Id: 0, HRef: null },
      StudyClassRef: { Id: 0, HRef: null },
      ConfirmationStateId:
        absence?.ConfirmationStateId ||
        (dispensation && this.settings.excusedAbsenceStateId) ||
        null,
      EventDesignation: timetableEntry.EventDesignation || "",
      HasStudyCourseConfirmationCode: false,
      LessonDateTimeFrom: timetableEntry.From || new Date(),
      LessonDateTimeTo: timetableEntry.To || new Date(),
      Comment: null,
      Date: timetableEntry.From || new Date(),
      Type: (absence || dispensation)?.Type || null,
      StudentFullName: (absence || dispensation)?.StudentFullName || "",
      StudyClassNumber: "", // Currently not available on timetable entry
      TeacherInformation: timetableEntry.EventManagerInformation,
    };
  }

  private buildLessonPresenceTypeRef(
    absence?: LessonAbsence,
    dispensation?: LessonDispensation,
  ): OptionalReference {
    if (absence) {
      return { ...absence.TypeRef };
    } else if (dispensation) {
      return { ...dispensation.TypeRef };
    }
    return { Id: null, HRef: null };
  }
}
