import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Event, EventDesignation, EventSummary } from "../models/event.model";
import { SubscriptionDetail } from "../models/subscription.model";
import { decodeArray } from "../utils/decode";
import { paginatedParams } from "../utils/pagination";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class EventsRestService extends RestService<typeof Event> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, Event, "Events");
  }

  getStudyCourseEvents(): Observable<ReadonlyArray<Event>> {
    const params = new HttpParams().set("filter.EventTypeId", "=1");
    return this.getList({ params });
  }

  getSubscriptionDetailsDefinitions(
    eventId: number,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${eventId}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(SubscriptionDetail)));
  }

  getEventSummary(eventId: number): Observable<Option<EventSummary>> {
    const params: Dict<string> = {
      fields: "Id,EventTypeId,EventType,Designation,StatusId",
      "filter.Id": `=${eventId}`,
    };
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params,
      })
      .pipe(
        switchMap(decodeArray(EventSummary)),
        map((summaries) => summaries[0] ?? null),
      );
  }

  getEventDesignations(
    eventIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<EventDesignation>> {
    const params = new HttpParams()
      .set("fields", "Id,Designation")
      .set("filter.Id", `;${eventIds.join(";")}`);

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(0, 0, params),
      })
      .pipe(switchMap(decodeArray(EventDesignation)));
  }
}
