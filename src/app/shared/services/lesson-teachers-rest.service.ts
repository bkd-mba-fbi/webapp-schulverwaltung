import { Inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { LessonAbsence } from '../models/lesson-absence.model';
import { HttpClient } from '@angular/common/http';
import { Settings, SETTINGS } from '../../settings';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { decodeArray } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class LessonTeachersRestService extends RestService<
  typeof LessonAbsence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonAbsence, 'LessonTeachers');
  }

  getLessonAbsencesForStudent(
    studentId: number
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/except/${studentId}/LessonAbsences?expand=LessonRef`
      )
      .pipe(switchMap(decodeArray(this.codec)));
  }
}
