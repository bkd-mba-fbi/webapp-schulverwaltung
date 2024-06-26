import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Event } from "../models/event.model";
import { SubscriptionDetail } from "../models/subscription-detail.model";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class EventsRestService extends RestService<typeof Event> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Event, "Events");
  }

  getStudyCourseEvents(): Observable<ReadonlyArray<Event>> {
    const params = new HttpParams().set("filter.EventTypeId=", "1");
    return this.getList({ params });
  }

  getSubscriptionDetailsDefinitions(
    eventId: number,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${eventId}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(SubscriptionDetail)));
  }
}
