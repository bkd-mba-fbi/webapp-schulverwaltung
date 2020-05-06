import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { format, isSameDay, addDays, subDays } from 'date-fns';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
import { Sorting } from './paginated-entries.service';
import { spreadTuple } from '../utils/function';
import { mergeUniqueLessonPresences } from 'src/app/open-absences/utils/open-absences-entries';
import { StorageService } from './storage.service';
import { log } from '../utils/observable';

@Injectable({
  providedIn: 'root',
})
export class LessonPresencesRestService extends RestService<
  typeof LessonPresence
> {
  constructor(
    http: HttpClient,
    @Inject(SETTINGS) settings: Settings,
    private storage: StorageService
  ) {
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

  /**
   * Returns the list of unconfirmed absences, considering the user's
   * role (merges the presences from two requests for class teachers
   * or uses a single request for lesson teachers).
   */
  getListOfUnconfirmed(): Observable<ReadonlyArray<LessonPresence>> {
    const tokenPayload = this.storage.getPayload();
    const roles = tokenPayload ? tokenPayload.roles : '';
    const classTeacher = roles.indexOf('ClassTeacherRole') > 0;
    if (classTeacher) {
      return forkJoin([
        this.getListOfUnconfirmedClassTeacher(),
        this.getListOfUnconfirmedLessonTeacher(),
      ]).pipe(map(spreadTuple(mergeUniqueLessonPresences)));
    }
    return this.getListOfUnconfirmedLessonTeacher();
  }

  getStatistics(
    absencesFilter: EvaluateAbsencesFilter,
    absencesSorting: Option<Sorting<LessonPresenceStatistic>>,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresenceStatistic>>> {
    let params = filteredParams([
      [absencesFilter.student, 'StudentRef'],
      [absencesFilter.educationalEvent, 'EventRef'],
      [absencesFilter.studyClass, 'StudyClassRef'],
    ]);
    params = sortedParams(absencesSorting, params);
    params = paginatedParams(offset, this.settings.paginationLimit, params);

    return this.http
      .get<unknown>(`${this.baseUrl}/Statistics`, {
        params,
        headers: paginatedHeaders(),
        observe: 'response',
      })
      .pipe(decodePaginatedResponse(LessonPresenceStatistic));
  }

  getFilteredList(
    absencesFilter: EditAbsencesFilter,
    offset: number,
    additionalParams?: Dict<string>
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    let params = filteredParams([
      [absencesFilter.student, 'StudentRef'],
      [absencesFilter.educationalEvent, 'EventRef'],
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
    if (additionalParams) {
      Object.keys(additionalParams).forEach(
        (key) => (params = params.set(key, additionalParams[key]))
      );
    }

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(offset, this.settings.paginationLimit, params),
        headers: paginatedHeaders(),
        observe: 'response',
      })
      .pipe(decodePaginatedResponse(LessonPresence));
  }

  private getListOfUnconfirmedLessonTeacher(): Observable<
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

  private getListOfUnconfirmedClassTeacher(): Observable<
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
}

/**
 * Builds a `HttpParams` object for the given filter values (an array
 * of item/field tuples). All non-Id values have to be
 * custom added to the returned `HttpParams`.
 */
function filteredParams(
  filterValues: ReadonlyArray<[Option<number>, string]>,
  params = new HttpParams()
): HttpParams {
  return filterValues.reduce((acc, [item, field]) => {
    if (item && field) {
      return acc.set(`filter.${field}`, `=${item}`);
    }
    return acc;
  }, params);
}

function sortedParams<T>(
  sorting: Option<Sorting<T>>,
  params = new HttpParams()
): HttpParams {
  if (!sorting) {
    return params;
  }
  return params.set(
    'sort',
    `${sorting.key}.${sorting.ascending ? 'asc' : 'desc'}`
  );
}
