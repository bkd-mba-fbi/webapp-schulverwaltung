import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { SETTINGS, Settings } from 'src/app/settings';

@Injectable({
  providedIn: 'root'
})
export class LessonPresencesUpdateRestService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  editLessonPresences(
    lessonIds: ReadonlyArray<number>,
    personIds: ReadonlyArray<number>,
    presenceTypeId?: Option<number>,
    confirmationValue?: Option<number>,
    comment?: Option<string>,
    params?: HttpParams
  ): Observable<void> {
    const body: Dict<any> = {
      LessonIds: lessonIds,
      PersonIds: personIds
    };
    if (presenceTypeId !== undefined) {
      body.AbsenceTypeId = presenceTypeId;
    }
    if (confirmationValue !== undefined) {
      body.ConfirmationValue = confirmationValue;
    }
    if (comment !== undefined) {
      body.Comment = comment;
    }

    return this.http
      .put<void>(`${this.settings.apiUrl}/LessonPresences/Edit/`, body, {
        params
      })
      .pipe(mapTo(undefined));
  }

  removeLessonPresences(
    lessonIds: ReadonlyArray<number>,
    personIds: ReadonlyArray<number>,
    params?: HttpParams
  ): Observable<void> {
    return this.http
      .put<void>(
        `${this.settings.apiUrl}/LessonPresences/Reset/`,
        {
          LessonIds: lessonIds,
          PersonIds: personIds
        },
        { params }
      )
      .pipe(mapTo(undefined));
  }
}
