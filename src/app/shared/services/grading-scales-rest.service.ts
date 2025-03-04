import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, forkJoin, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { GradingScale } from "../models/grading-scale.model";
import { decode } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class GradingScalesRestService extends RestService<typeof GradingScale> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, GradingScale, "GradingScales");
  }

  getGradingScale(id: number): Observable<GradingScale> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`)
      .pipe(switchMap(decode(GradingScale)));
  }

  getGradingScales(
    gradingScaleIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<GradingScale>> {
    return forkJoin(gradingScaleIds.map(this.getGradingScale.bind(this)));
  }
}
