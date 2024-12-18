import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GroupOption } from "../../presence-control/components/presence-control-group-dialog/presence-control-group-dialog.component";
import { SETTINGS, Settings } from "../../settings";
import { SubscriptionDetail } from "../models/subscription.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionDetailsRestService extends RestService<
  typeof SubscriptionDetail
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, SubscriptionDetail, "SubscriptionDetails");
  }

  getListForEvent(
    eventId: number,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.getList({ params: { IdEvent: String(eventId) } });
  }

  update(
    group: GroupOption["id"],
    detail: SubscriptionDetail,
  ): Observable<void> {
    const body = {
      IdPerson: detail.IdPerson,
      EventId: detail.EventId,
      Value: group,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${detail.Id}`, body)
      .pipe(map(() => undefined));
  }
}
