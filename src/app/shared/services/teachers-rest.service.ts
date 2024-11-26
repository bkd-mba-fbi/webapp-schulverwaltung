import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
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
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Teacher, "Teachers");
  }

  getTimetableEntries(
    teacherId: number,
    params: HttpParams | Dict<string> = {},
  ): Observable<ReadonlyArray<TimetableEntry>> {
    if (!(params instanceof HttpParams)) {
      params = new HttpParams({ fromObject: params });
    }
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
