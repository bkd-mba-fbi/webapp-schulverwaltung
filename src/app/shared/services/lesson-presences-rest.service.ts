import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { format } from 'date-fns';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import {
  LessonPresenceProps,
  LessonPresence
} from '../models/lesson-presence.model';

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
    // TODO: Check if the date time can be filtered by day like this
    return this.getList({
      'filter.LessonDateTimeFrom': `=${format(date, 'YYYY-MM-DD')}`
    });
  }
}
