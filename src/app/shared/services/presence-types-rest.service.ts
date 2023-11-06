import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
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
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, PresenceType, "PresenceTypes");
  }
}
