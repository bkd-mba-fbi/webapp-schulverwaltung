import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { AdditionalInformationCode } from "../models/additional-informations.model";
import { DropDownItem } from "../models/drop-down-item.model";
import { decodeArray } from "../utils/decode";

@Injectable({
  providedIn: "root",
})
export class DropDownItemsRestService {
  private http = inject(HttpClient);
  private settings = inject<Settings>(SETTINGS);

  getWeekdays(): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Weekdays`)
      .pipe(switchMap(decodeArray(DropDownItem)), shareReplay(1));
  }

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

  getAdditionalInformationCodes(): Observable<
    ReadonlyArray<AdditionalInformationCode>
  > {
    return this.http
      .get<unknown>(`${this.baseUrl}/AdditionalInformationCodes`)
      .pipe(switchMap(decodeArray(AdditionalInformationCode)), shareReplay(1));
  }

  private get baseUrl(): string {
    return `${this.settings.apiUrl}/DropDownItems`;
  }
}
