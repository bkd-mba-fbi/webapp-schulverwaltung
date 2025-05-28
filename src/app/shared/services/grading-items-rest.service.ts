import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { GradingItem } from "../models/grading-item.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class GradingItemsRestService extends RestService<typeof GradingItem> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, GradingItem, "GradingItems");
  }

  getListForEvent(eventId: number): Observable<ReadonlyArray<GradingItem>> {
    const params = new HttpParams().set("idEvent", eventId);
    return this.getList({ params });
  }

  updateForEvent(
    eventId: number,
    gradingItems: ReadonlyArray<GradingItem>,
  ): Observable<void> {
    const params = new HttpParams().set("idEvent", eventId);
    return this.http.put<void>(`${this.baseUrl}/`, gradingItems, { params });
  }

  update(gradingItem: GradingItem): Observable<void> {
    const url = `${this.baseUrl}/${gradingItem.Id}`;
    return this.http.put<void>(url, gradingItem);
  }

  updateComment(
    gradingItemId: string,
    comment: string | null,
  ): Observable<void> {
    const url = `${this.baseUrl}/${gradingItemId}`;
    return this.http.put<void>(url, { Comment: comment });
  }
}
