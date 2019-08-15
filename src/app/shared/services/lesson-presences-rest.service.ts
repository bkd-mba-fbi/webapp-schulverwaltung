import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SETTINGS, Settings } from '../../settings';
import {
  LessonPresence,
  LessonPresenceProps
} from '../models/lesson-presence.model';
import { decodeArray } from '../utils/decode';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class LessonPresencesRestService extends RestService<
  LessonPresenceProps
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
}
