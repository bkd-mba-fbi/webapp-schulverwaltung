import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, map, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { StatusProcess } from "../models/status-process.model";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class StatusProcessesRestService extends RestService<
  typeof StatusProcess
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, StatusProcess, "StatusProcesses");
  }

  getForwardByStatus(
    statusId: number,
  ): Observable<ReadonlyArray<StatusProcess>> {
    const params: Dict<string> = { idStatus: String(statusId) };
    return this.http
      .get<unknown>(`${this.baseUrl}/forward/`, { params })
      .pipe(switchMap(decodeArray(StatusProcess)));
  }

  updateStatus(
    subscriptionId: number,
    personId: number,
    statusId: number,
  ): Observable<void> {
    return this.http
      .post(`${this.baseUrl}/`, {
        DataClassId: "PersonenAnmeldung",
        Id1: subscriptionId,
        Id2: personId,
        IdStatus: statusId,
      })
      .pipe(map(() => undefined));
  }
}
