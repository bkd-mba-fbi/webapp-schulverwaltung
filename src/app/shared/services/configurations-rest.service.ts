import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { SubscriptionDetailsDisplay } from "../models/configurations.model";
import { decode } from "../utils/decode";

@Injectable({
  providedIn: "root",
})
export class ConfigurationsRestService {
  private settings = inject<Settings>(SETTINGS);
  private resourcePath = "Configurations";
  private http = inject(HttpClient);

  getSubscriptionDetailsDisplay(): Observable<SubscriptionDetailsDisplay> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Grading`)
      .pipe(switchMap(decode(SubscriptionDetailsDisplay)));
  }

  private get baseUrl(): string {
    return `${this.settings.apiUrl}/${this.resourcePath}`;
  }
}
