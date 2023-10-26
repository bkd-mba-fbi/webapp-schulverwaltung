import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { switchMap, shareReplay } from "rxjs/operators";
import { decodeArray } from "../utils/decode";

import { SETTINGS, Settings } from "src/app/settings";
import { DropDownItem } from "../models/drop-down-item.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DropDownItemsRestService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  getAbsenceConfirmationStates(): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/AbsenceConfirmationStates`)
      .pipe(switchMap(decodeArray(DropDownItem)), shareReplay(1));
  }

  getStayPermits(): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/StayPermits`)
      .pipe(switchMap(decodeArray(DropDownItem)), shareReplay(1));
  }

  private get baseUrl(): string {
    return `${this.settings.apiUrl}/DropDownItems`;
  }
}
