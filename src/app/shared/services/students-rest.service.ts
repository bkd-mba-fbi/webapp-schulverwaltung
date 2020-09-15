import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SETTINGS, Settings } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';
import { decodeArray } from '../utils/decode';
import { Student } from '../models/student.model';
import { LegalRepresentative } from '../models/legal-representative.model';
import { ApprenticeshipContract } from '../models/apprenticeship-contract.model';
import { TimetableEntry } from '../models/timetable-entry.model';
import { LessonAbsence } from '../models/lesson-absence.model';
import { LessonIncident } from '../models/lesson-incident.model';
import { LessonDispensation } from '../models/lesson-dispensation.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsRestService extends TypeaheadRestService<typeof Student> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Student, 'Students', 'FullName');
  }

  getLegalRepresentatives(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}/${studentId}/LegalRepresentatives`, {
        params,
      })
      .pipe(switchMap(decodeArray(LegalRepresentative)));
  }

  getCurrentApprenticeshipContracts(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${studentId}/ApprenticeshipContracts/Current`,
        {
          params,
        }
      )
      .pipe(switchMap(decodeArray(ApprenticeshipContract)));
  }

  getLessonAbsences(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonAbsences`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonAbsence)));
  }

  getLessonIncidents(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LessonIncident>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonIncidents`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonIncident)));
  }

  getLessonDispensations(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LessonDispensation>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/LessonDispensations`, {
        params,
      })
      .pipe(switchMap(decodeArray(LessonDispensation)));
  }

  getTimetableEntries(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<TimetableEntry>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${studentId}/TimetableEntries`, {
        params,
      })
      .pipe(switchMap(decodeArray(TimetableEntry)));
  }
}
