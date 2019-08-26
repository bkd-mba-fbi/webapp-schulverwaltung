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

@Injectable({
  providedIn: 'root'
})
export class LessonPresencesRestService extends RestService<
  typeof LessonPresence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonPresence, 'LessonPresences');
  }

  getListByDate(date: Date): Observable<ReadonlyArray<LessonPresence>> {
    return this.getList({
      'filter.LessonDateTimeFrom': `=${format(date, 'YYYY-MM-DD')}`
    });
  }

  getListForToday(): Observable<ReadonlyArray<LessonPresence>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Today`)
      .pipe(switchMap(decodeArray(this.codec)));
  }

  getListOfUnconfirmed(): Observable<ReadonlyArray<LessonPresence>> {
    return this.getList({
      'filter.TypeRef': `=${this.settings.absencePresenceTypeId}`,
      'filter.ConfirmationStateId': `=${this.settings.unconfirmedAbsenceStateId}`,
      'filter.HasStudyCourseConfirmationCode': '=false'
    });
  }

  getStatistics(
    absencesFilter: EvaluateAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresenceStatistic>> {
    let params = new HttpParams();

    params = absencesFilter.student
      ? params.set('filter.StudentRef', `=${absencesFilter.student.id}`)
      : params;

    params = absencesFilter.moduleInstance
      ? params.set(
          'filter.ModuleInstanceRef',
          `=${absencesFilter.moduleInstance.id}`
        )
      : params;

    params = absencesFilter.studyClass
      ? params.set('filter.StudyClassRef', `=${absencesFilter.studyClass.id}`)
      : params;

    return this.http
      .get<unknown>(`${this.baseUrl}/Statistics`, { params })
      .pipe(switchMap(decodeArray(LessonPresenceStatistic)));
  }

  getFilteredList(
    absencesFilter: EditAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresence>> {
    let params = new HttpParams();

    params = absencesFilter.student
      ? params.set('filter.StudentRef', `=${absencesFilter.student.id}`)
      : params;

    params = absencesFilter.moduleInstance
      ? params.set('filter.EventRef', `=${absencesFilter.moduleInstance.id}`)
      : params;

    params = absencesFilter.studyClass
      ? params.set('filter.StudyClassRef', `=${absencesFilter.studyClass.id}`)
      : params;

    if (
      absencesFilter.dateFrom &&
      absencesFilter.dateTo &&
      isSameDay(absencesFilter.dateFrom, absencesFilter.dateTo)
    ) {
      params = params.set(
        'filter.LessonDateTimeFrom',
        `=${format(absencesFilter.dateFrom, 'YYYY-MM-DD')}`
      );
    } else {
      if (absencesFilter.dateFrom) {
        params = params.set(
          'filter.LessonDateTimeFrom',
          `>${format(subDays(absencesFilter.dateFrom, 1), 'YYYY-MM-DD')}`
        );
      }
      if (absencesFilter.dateTo) {
        params = params.set(
          'filter.LessonDateTimeTo',
          `>${format(addDays(absencesFilter.dateTo, 1), 'YYYY-MM-DD')}`
        );
      }
    }

    params = absencesFilter.presenceType
      ? params.set('filter.TypeRef', `=${absencesFilter.presenceType.Key}`)
      : params;

    params = absencesFilter.confirmationState
      ? params.set(
          'filter.ConfirmationStateId',
          `=${absencesFilter.confirmationState.Key}`
        )
      : params;

    return this.getList(params);
  }
}
