import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { StudyClass } from "../models/study-class.model";
import { decodeArray } from "../utils/decode";
import { TypeaheadRestService } from "./typeahead-rest.service";

@Injectable({
  providedIn: "root",
})
export class StudyClassesRestService extends TypeaheadRestService<
  typeof StudyClass
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, StudyClass, "StudyClasses", "Number");
  }

  getActive(): Observable<ReadonlyArray<StudyClass>> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}/?filter.IsActive==true`, {
        headers: { "X-Role-Restriction": "ClassTeacherRole" },
      })
      .pipe(switchMap(decodeArray(StudyClass)));
  }

  getActiveFormativeAssessments(): Observable<ReadonlyArray<StudyClass>> {
    return this.http
      .get<unknown[]>(
        `${this.baseUrl}/FormativeAssessments?filter.IsActive==true`,
        {
          headers: { "X-Role-Restriction": "ClassTeacherRole" },
        },
      )
      .pipe(switchMap(decodeArray(StudyClass)));
  }
}
