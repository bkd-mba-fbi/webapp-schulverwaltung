import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { Grading } from "../models/course.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class GradingsRestService extends RestService<typeof Grading> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Grading, "Gradings");
  }

  updateGrade(
    finaleGradeId: number,
    selectedGradeId: number,
  ): Observable<number> {
    return this.http
      .put(`${this.baseUrl}/${finaleGradeId}`, { GradeId: selectedGradeId })
      .pipe(map(() => finaleGradeId));
  }
}
