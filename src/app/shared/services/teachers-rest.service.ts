import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import * as t from "io-ts";
import { Observable, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { TimetableEntry } from "../models/timetable-entry.model";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

// Dummy type, yet unused
const Teacher = t.type({});

@Injectable({
  providedIn: "root",
})
export class TeachersRestService extends RestService<typeof Teacher> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, Teacher, "Teachers");
  }

  getTimetableEntries(
    teacherId: number,
    customParams: HttpParams | Dict<string> = {},
  ): Observable<ReadonlyArray<TimetableEntry>> {
    let params: HttpParams =
      customParams instanceof HttpParams
        ? customParams
        : new HttpParams({ fromObject: customParams });
    params = params.set(
      "fields",
      "Id,From,To,EventId,EventNumber,EventDesignation,EventLocation",
    );
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${teacherId}/TimetableEntries/CurrentSemester`,
        {
          params,
        },
      )
      .pipe(switchMap(decodeArray(TimetableEntry)));
  }
}
