import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { SETTINGS, Settings } from "../../settings";
import { PresenceType } from "../models/presence-type.model";
import { RestService } from "./rest.service";

/**
 * Don't use this service to load presence types in
 * components/services, use the `PresenceTypesService` instead, that
 * caches these entries and loads them only once throughout the
 * application.
 */
@Injectable({
  providedIn: "root",
})
export class PresenceTypesRestService extends RestService<typeof PresenceType> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, PresenceType, "PresenceTypes");
  }
}
