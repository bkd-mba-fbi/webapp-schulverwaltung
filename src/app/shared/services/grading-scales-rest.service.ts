import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { GradingScale } from "../models/grading-scale.model";
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

  getListForIds(
    gradingScaleIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<GradingScale>> {
    return forkJoin(gradingScaleIds.map((id) => this.get(id)));
  }
}
