import { HttpClient, HttpContext } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";

@Injectable({
  providedIn: "root",
})
export class LessonPresencesUpdateRestService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  editLessonPresences(
    lessonIds: ReadonlyArray<number>,
    personIds: ReadonlyArray<number>,
    presenceTypeId?: Option<number>,
    confirmationValue?: Option<number>,
    options?: { context?: HttpContext },
  ): Observable<void> {
    const body: Dict<unknown> = {
      LessonIds: lessonIds,
      PersonIds: personIds,
    };
    if (presenceTypeId !== undefined) {
      body["PresenceTypeId"] = presenceTypeId;
    }
    if (confirmationValue !== undefined) {
      body["ConfirmationValue"] = confirmationValue;
    }

    return this.http
      .put<void>(`${this.settings.apiUrl}/LessonPresences/Edit`, body, options)
      .pipe(map(() => undefined));
  }

  removeLessonPresences(
    lessonIds: ReadonlyArray<number>,
    personIds: ReadonlyArray<number>,
    options?: { context?: HttpContext },
  ): Observable<void> {
    return this.http
      .put<void>(
        `${this.settings.apiUrl}/LessonPresences/Reset`,
        {
          LessonIds: lessonIds,
          PersonIds: personIds,
          WithComment: true,
        },
        options,
      )
      .pipe(map(() => undefined));
  }

  confirmLessonPresences(
    lessonIds: ReadonlyArray<number>,
    personIds: ReadonlyArray<number>,
    absenceTypeId: number,
    confirmationValue: number,
  ): Observable<void> {
    const body: Dict<unknown> = {
      LessonIds: lessonIds,
      PersonIds: personIds,
      AbsenceTypeId: absenceTypeId,
      ConfirmationValue: confirmationValue,
    };

    return this.http
      .put<void>(`${this.settings.apiUrl}/LessonAbsences/Confirm`, body)
      .pipe(map(() => undefined));
  }
}
