import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { SETTINGS, Settings } from "../../settings";
import { ApprenticeshipManager } from "../models/apprenticeship-manager.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class ApprenticeshipManagersRestService extends RestService<
  typeof ApprenticeshipManager
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, ApprenticeshipManager, "ApprenticeshipManagers");
  }
}
