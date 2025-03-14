import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { subDays } from "date-fns/subDays";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { LessonAbsence } from "../models/lesson-absence.model";
import { formatISOLocalDate } from "../utils/date";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class LessonTeachersRestService extends RestService<
  typeof LessonAbsence
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, LessonAbsence, "LessonTeachers");
  }

  /**
   * Returns all lesson absences CreatedOn after today-60 days and the specified students
   * for all teachers except the specified teacher.
   */
  loadOtherTeachersLessonAbsences(
    personId: number,
    students: number[],
    params?: HttpParams | Dict<string>,
  ): Observable<ReadonlyArray<LessonAbsence>> {
    const fromDate = subDays(new Date(), 60);

    let url = `${this.baseUrl}/except/${personId}/LessonAbsences?expand=LessonRef&filter.CreatedOn=>${formatISOLocalDate(fromDate)}`;
    if (students && students.length > 0) {
      url = url.concat("&filter.StudentRef=;" + students.join(";"));
    }
    return this.http
      .get<unknown>(url, { params })
      .pipe(switchMap(decodeArray(LessonAbsence)));
  }
}
