import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { SubscriptionDetail } from "../models/subscription.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionDetailsRestService extends RestService<
  typeof SubscriptionDetail
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, SubscriptionDetail, "SubscriptionDetails");
  }

  getListForEvent(
    eventId: number,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.getList({ params: { IdEvent: String(eventId) } });
  }

  update(
    detail: Pick<SubscriptionDetail, "Id" | "IdPerson" | "EventId">,
    value: SubscriptionDetail["Value"],
    context?: HttpContext,
  ): Observable<void> {
    const body = {
      IdPerson: detail.IdPerson,
      EventId: detail.EventId,
      Value: value,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${detail.Id}`, body, { context })
      .pipe(map(() => undefined));
  }
}
