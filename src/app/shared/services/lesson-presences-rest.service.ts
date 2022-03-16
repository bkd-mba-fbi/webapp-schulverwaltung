import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import * as t from 'io-ts';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';
import { mergeUniqueLessonPresences } from 'src/app/open-absences/utils/open-absences-entries';
import { SETTINGS, Settings } from '../../settings';
import { LessonPresenceStatistic } from '../models/lesson-presence-statistic';
import { LessonPresence } from '../models/lesson-presence.model';
import { decodeArray } from '../utils/decode';
import { spread } from '../utils/function';
import {
  decodePaginatedResponse,
  Paginated,
  paginatedHeaders,
  paginatedParams,
} from '../utils/pagination';
import { pick } from '../utils/types';
import { RestService } from './rest.service';
import { Sorting } from './sort.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LessonPresencesRestService extends RestService<
  typeof LessonPresence
> {
  protected lessonPresenceRefCodec = t.type(
    pick(this.codec.props, [
      'LessonRef',
      'RegistrationRef',
      'StudentRef',
      'EventRef',
      'StudyClassRef',
      'TypeRef',
    ])
  );

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
  getListOfUnconfirmed(
    params?: Dict<string>
  ): Observable<ReadonlyArray<LessonPresence>> {
    const tokenPayload = this.storage.getPayload();
    const roles = tokenPayload ? tokenPayload.roles : '';
    const classTeacher = roles.indexOf('ClassTeacherRole') > 0;
    if (classTeacher) {
      return forkJoin([
        this.getListOfUnconfirmedClassTeacher(params),
        this.getListOfUnconfirmedLessonTeacher(params),
      ]).pipe(map(spread(mergeUniqueLessonPresences)));
    }
    return this.getListOfUnconfirmedLessonTeacher(params);
  }

  getStatistics(
    absencesFilter: EvaluateAbsencesFilter,
    absencesSorting: Option<Sorting<keyof LessonPresenceStatistic>>,
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

  getLessonRefs(
    absencesFilter: EvaluateAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresence>> {
    let params = filteredParams([
      [absencesFilter.student, 'StudentRef'],
      [absencesFilter.educationalEvent, 'EventRef'],
      [absencesFilter.studyClass, 'StudyClassRef'],
    ]);

    params = params.set('filter.TypeRef', '>0');
    params = params.set(
      'fields',
      [
        'LessonRef',
        'RegistrationRef',
        'StudentRef',
        'EventRef',
        'StudyClassRef',
        'TypeRef',
      ].join(',')
    );

    return this.http
      .get<unknown>(`${this.baseUrl}/`, { params })
      .pipe(switchMap(decodeArray(this.lessonPresenceRefCodec)));
  }

  getRegistrationRefsByEventIds(
    eventIds: ReadonlyArray<number>
  ): Observable<ReadonlyArray<LessonPresence>> {
    let params = new HttpParams();
    params.set('filter.EventRef', `;${eventIds.join(';')}`);
    params = params.set(
      'fields',
      [
        'LessonRef',
        'RegistrationRef',
        'StudentRef',
        'EventRef',
        'StudyClassRef',
        'TypeRef',
      ].join(',')
    );

    return this.http
      .get<unknown>(`${this.baseUrl}/`, { params })
      .pipe(switchMap(decodeArray(this.lessonPresenceRefCodec)));
  }

  getFilteredList(
    absencesFilter: EditAbsencesFilter,
    offset: number,
    additionalParams?: Dict<string>
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    let params = filteredParams(
      [
        [absencesFilter.student, 'StudentRef'],
        [absencesFilter.educationalEvent, 'EventRef'],
        [absencesFilter.studyClass, 'StudyClassRef'],
      ],
      new HttpParams({ fromObject: additionalParams })
    );

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

    if (absencesFilter.confirmationStates) {
      params = params.set(
        'filter.ConfirmationStateId',
        `;${absencesFilter.confirmationStates.join(';')}`
      );
    }

    if (absencesFilter.incidentTypes) {
      params = params.set(
        'filter.TypeRef',
        `;${absencesFilter.incidentTypes.join(';')}`
      );
    }

    if (absencesFilter.presenceTypes) {
      params = params.set(
        'filter.TypeRef',
        `;${absencesFilter.presenceTypes.join(';')}`
      );
    }

    if (absencesFilter.incidentTypes && absencesFilter.presenceTypes) {
      params = params.set(
        'filter.TypeRef',
        `;${absencesFilter.presenceTypes.join(
          ';'
        )};${absencesFilter.incidentTypes.join(';')}`
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

  private getListOfUnconfirmedLessonTeacher(
    params?: Dict<string>
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.getList({
      headers: { 'X-Role-Restriction': 'LessonTeacherRole' },
      params: {
        ...params,
        'filter.ConfirmationStateId': `=${this.settings.unconfirmedAbsenceStateId}`,
        'filter.HasStudyCourseConfirmationCode': '=false',
      },
    });
  }

  private getListOfUnconfirmedClassTeacher(
    params?: Dict<string>
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.getList({
      headers: {
        'X-Role-Restriction': 'ClassTeacherRole',
      },
      params: {
        ...params,
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
