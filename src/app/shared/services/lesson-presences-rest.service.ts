import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SETTINGS, Settings } from '../../settings';
import { LessonPresence } from '../models/lesson-presence.model';
import { decodeArray } from '../utils/decode';
import { RestService } from './rest.service';
import { LessonPresenceStatistic } from '../models/lesson-presence-statistic';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';

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
      ? params.set('filter.StudentRef=', String(absencesFilter.student.id))
      : params;

    params = absencesFilter.moduleInstance
      ? params.set(
          'filter.ModuleInstanceRef=',
          String(absencesFilter.moduleInstance.id)
        )
      : params;

    params = absencesFilter.studyClass
      ? params.set(
          'filter.StudyClassRef=',
          String(absencesFilter.studyClass.id)
        )
      : params;

    return this.http
      .get<unknown>(`${this.baseUrl}/Statistics`, { params })
      .pipe(switchMap(decodeArray(LessonPresenceStatistic)));
  }
}
