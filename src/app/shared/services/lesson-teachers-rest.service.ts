import { Inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings, SETTINGS } from '../../settings';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { decodeArray } from '../utils/decode';
import { LessonAbsence } from '../models/lesson-absence.model';

@Injectable({
  providedIn: 'root',
})
export class LessonTeachersRestService extends RestService<
  typeof LessonAbsence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonAbsence, 'LessonTeachers');
  }

  loadOtherLessonAbsences(
    personId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/except/${personId}/LessonAbsences?expand=LessonRef`,
        { params }
      )
      .pipe(switchMap(decodeArray(LessonAbsence)));
  }
}
