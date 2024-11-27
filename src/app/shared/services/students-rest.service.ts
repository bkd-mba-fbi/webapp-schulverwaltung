import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { ApprenticeshipContract } from "../models/apprenticeship-contract.model";
import { LegalRepresentative } from "../models/legal-representative.model";
import { LessonAbsence } from "../models/lesson-absence.model";
import { LessonDispensation } from "../models/lesson-dispensation.model";
import { LessonIncident } from "../models/lesson-incident.model";
import { Student, StudentSummary } from "../models/student.model";
import { TimetableEntry } from "../models/timetable-entry.model";
import { decodeArray } from "../utils/decode";
import { TypeaheadRestService } from "./typeahead-rest.service";

@Injectable({
  providedIn: "root",
})
export class StudentsRestService extends TypeaheadRestService<typeof Student> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Student, "Students", "FullName");
  }

  getLegalRepresentatives(
    studentId: number,
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}/${studentId}/LegalRepresentatives`, {
        params,
      })
      .pipe(switchMap(decodeArray(LegalRepresentative)));
  }

  getCurrentApprenticeshipContracts(
    studentId: number,
    options?: { context?: HttpContext },
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${studentId}/ApprenticeshipContracts/Current`,
        options,
      )
      .pipe(switchMap(decodeArray(ApprenticeshipContract)));
  }

  getLessonAbsences(
    studentId: number,
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonAbsences`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonAbsence)));
  }

  getLessonIncidents(
    studentId: number,
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LessonIncident>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonIncidents`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonIncident)));
  }

  getLessonDispensations(
    studentId: number,
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LessonDispensation>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonDispensations`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonDispensation)));
  }

  getTimetableEntries(
    studentId: number,
    params: HttpParams | Dict<string> = {},
  ): Observable<ReadonlyArray<TimetableEntry>> {
    if (!(params instanceof HttpParams)) {
      params = new HttpParams({ fromObject: params });
    }
    params = params.set(
      "fields",
      "Id,From,To,EventId,EventNumber,EventDesignation,EventLocation,EventManagerInformation",
    );
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${studentId}/TimetableEntries/CurrentSemester`,
        {
          params,
        },
      )
      .pipe(switchMap(decodeArray(TimetableEntry)));
  }

  getStudentSummaries(
    ids: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<StudentSummary>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.Id": `;${ids.join(";")}`,
          fields: ["Id", "FirstName", "LastName", "DisplayEmail"].join(","),
        },
      })
      .pipe(switchMap(decodeArray(StudentSummary)));
  }
}
