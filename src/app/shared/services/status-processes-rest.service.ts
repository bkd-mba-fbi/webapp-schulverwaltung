import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { StatusProcess } from "../models/status-process.model";
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

  getListByStatus(statusId: number): Observable<ReadonlyArray<StatusProcess>> {
    const params: Dict<string> = { idStatus: String(statusId) };
    return super.getList({ params });
  }
}
