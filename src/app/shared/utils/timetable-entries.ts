import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { TimetableEntry } from "../models/timetable-entry.model";
import { decodeArray } from "./decode";

export function fetchTimetableEntries(
  http: HttpClient,
  url: string,
  {
    additionalFields,
    ...options
  }: {
    params?: HttpParams | Dict<string>;
    headers?: HttpHeaders | Dict<string>;
    additionalFields?: ReadonlyArray<string>;
  } = {},
): Observable<ReadonlyArray<TimetableEntry>> {
  let params: HttpParams =
    options.params instanceof HttpParams
      ? options.params
      : new HttpParams({ fromObject: options.params });
  params = params
    .set(
      "fields",
      [
        "Id",
        "From",
        "To",
        "EventId",
        "EventNumber",
        "EventDesignation",
        "EventLocation",
        "Rooms",
        ...(additionalFields ?? []),
      ].join(","),
    )
    .set("expand", "Rooms");
  return http
    .get<unknown>(url, {
      ...options,
      params,
    })
    .pipe(switchMap(decodeArray(TimetableEntry)));
}
