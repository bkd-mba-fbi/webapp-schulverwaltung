import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { AccessInfo, UserSettings } from "../models/user-settings.model";
import { decode } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class UserSettingsRestService extends RestService<typeof UserSettings> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, UserSettings, "UserSettings");
  }

  getUserSettingsCst(
    params?: HttpParams | Dict<string>,
  ): Observable<UserSettings> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Cst`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  updateUserSettingsCst(updatedSettings: UserSettings): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/Cst`, updatedSettings);
  }

  getAccessInfo(): Observable<AccessInfo["AccessInfo"]> {
    return this.http.get<unknown>(`${this.baseUrl}/?expand=AccessInfo`).pipe(
      switchMap(decode(AccessInfo)),
      map(({ AccessInfo }) => AccessInfo),
    );
  }
}
