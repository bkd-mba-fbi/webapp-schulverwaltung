import { Inject, Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Settings, SETTINGS } from "../../settings";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { decodeArray } from "../utils/decode";
import { LessonAbsence } from "../models/lesson-absence.model";

@Injectable({
  providedIn: "root",
})
export class LessonTeachersRestService extends RestService<
  typeof LessonAbsence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonAbsence, "LessonTeachers");
  }

  /**
   * Returns all lesson absences for the current lesson and the specified students
   * for all teachers except the specified teacher.
   */
  loadOtherTeachersLessonAbsences(
    personId: number,
    students: number[],
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LessonAbsence>> {
    let url = `${this.baseUrl}/except/${personId}/LessonAbsences?expand=LessonRef`;
    if (students && students.length > 0) {
      url = url.concat("&filter.StudentRef=;" + students.join(";"));
    }
    return this.http
      .get<unknown>(url, { params })
      .pipe(switchMap(decodeArray(LessonAbsence)));
  }
}
