import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { format, isSameDay, addDays, subDays } from 'date-fns';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SETTINGS, Settings } from '../../settings';
import { LessonPresence } from '../models/lesson-presence.model';
import { decodeArray } from '../utils/decode';
import { RestService } from './rest.service';
import { LessonPresenceStatistic } from '../models/lesson-presence-statistic';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';
import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';
import {
  decodePaginatedResponse,
  Paginated,
  paginatedParams,
  paginatedHeaders,
} from '../utils/pagination';

@Injectable({
  providedIn: 'root',
})
export class LessonPresencesRestService extends RestService<
  typeof LessonPresence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonPresence, 'LessonPresences');
  }

  getListByDate(date: Date): Observable<ReadonlyArray<LessonPresence>> {
    return this.getList({
      params: {
        'filter.LessonDateTimeFrom': `=${format(date, 'yyyy-MM-dd')}`,
      },
      headers: { 'X-Role-Restriction': 'LessonTeacherRole' },
    });
  }

  getListForToday(): Observable<ReadonlyArray<LessonPresence>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Today`, {
        headers: { 'X-Role-Restriction': 'LessonTeacherRole' },
      })
      .pipe(switchMap(decodeArray(this.codec)));
  }

  getListOfUnconfirmedLessonTeacher(): Observable<
    ReadonlyArray<LessonPresence>
  > {
    return this.getList({
      headers: { 'X-Role-Restriction': 'LessonTeacherRole' },
      params: {
        'filter.TypeRef': `=${this.settings.absencePresenceTypeId}`,
        'filter.ConfirmationStateId': `=${this.settings.unconfirmedAbsenceStateId}`,
        'filter.HasStudyCourseConfirmationCode': '=false',
      },
    });
  }

  getListOfUnconfirmedClassTeacher(): Observable<
    ReadonlyArray<LessonPresence>
  > {
    return this.getList({
      headers: {
        'X-Role-Restriction': 'ClassTeacherRole',
      },
      params: {
        'filter.TypeRef': `=${this.settings.absencePresenceTypeId}`,
        'filter.ConfirmationStateId': `=${this.settings.unconfirmedAbsenceStateId}`,
        'filter.HasStudyCourseConfirmationCode': '=true',
      },
    });
  }

  getStatistics(
    absencesFilter: EvaluateAbsencesFilter,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresenceStatistic>>> {
    const params = buildHttpParamsForFilter([
      [absencesFilter.student, 'StudentRef'],
      [absencesFilter.moduleInstance, 'EventRef'],
      [absencesFilter.studyClass, 'StudyClassRef'],
    ]);
    return this.http
      .get<unknown>(`${this.baseUrl}/Statistics`, {
        params: paginatedParams(offset, this.settings.paginationLimit, params),
        headers: paginatedHeaders(),
        observe: 'response',
      })
      .pipe(decodePaginatedResponse(LessonPresenceStatistic));
  }

  getFilteredList(
    absencesFilter: EditAbsencesFilter,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    let params = buildHttpParamsForFilter([
      [absencesFilter.student, 'StudentRef'],
      [absencesFilter.moduleInstance, 'EventRef'],
      [absencesFilter.studyClass, 'StudyClassRef'],
      [absencesFilter.presenceType, 'TypeRef'],
      [absencesFilter.confirmationState, 'ConfirmationStateId'],
    ]);

    if (
      absencesFilter.dateFrom &&
      absencesFilter.dateTo &&
      isSameDay(absencesFilter.dateFrom, absencesFilter.dateTo)
    ) {
      params = params.set(
        'filter.LessonDateTimeFrom',
        `=${format(absencesFilter.dateFrom, 'yyyy-MM-dd')}`
      );
    } else {
      if (absencesFilter.dateFrom) {
        params = params.set(
          'filter.LessonDateTimeFrom',
          `>${format(subDays(absencesFilter.dateFrom, 1), 'yyyy-MM-dd')}`
        );
      }
      if (absencesFilter.dateTo) {
        params = params.set(
          'filter.LessonDateTimeTo',
          `<${format(addDays(absencesFilter.dateTo, 1), 'yyyy-MM-dd')}`
        );
      }
    }

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(offset, this.settings.paginationLimit, params),
        headers: paginatedHeaders(),
        observe: 'response',
      })
      .pipe(decodePaginatedResponse(LessonPresence));
  }
}

/**
 * Builds a `HttpParams` object for the given filter values (an array
 * of item/field tuples). All non-Id values have to be
 * custom added to the returned `HttpParams`.
 */
function buildHttpParamsForFilter(
  filterValues: ReadonlyArray<[Option<number>, string]>
): HttpParams {
  return filterValues.reduce((acc, [item, field]) => {
    if (item && field) {
      return acc.set(`filter.${field}`, `=${item}`);
    }
    return acc;
  }, new HttpParams());
}
