import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import * as t from "io-ts";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Identifiable } from "../models/common-types";
import { Subscription, SubscriptionDetail } from "../models/subscription.model";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionsRestService extends RestService<typeof Subscription> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Subscription, "Subscriptions");
  }

  getSubscriptionIdsByStudentAndCourse(
    personId: number,
    eventIds: number[],
  ): Observable<ReadonlyArray<number>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.PersonId": `=${personId}`,
          "filter.EventId": `;${eventIds}`,
        },
      })
      .pipe(
        switchMap(decodeArray(Identifiable)),
        map((result) => result.map((i) => i.Id)),
      );
  }

  getSubscriptionCountsByEvents(
    eventIds: ReadonlyArray<number>,
  ): Observable<Dict<number>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.EventId": `;${eventIds.join(";")}`,
          fields: ["Id", "EventId"].join(","),
        },
      })
      .pipe(
        switchMap(decodeArray(t.type({ Id: t.number, EventId: t.number }))),
        map((subscriptions) =>
          subscriptions.reduce<Dict<number>>((acc, s) => {
            acc[s.EventId] = acc[s.EventId] ? acc[s.EventId] + 1 : 1;
            return acc;
          }, {}),
        ),
      );
  }

  getSubscriptionsByCourse(
    eventId: number,
    additionalParams?: Dict<string>,
  ): Observable<ReadonlyArray<Subscription>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.EventId": `=${eventId}`,
          ...additionalParams,
          fields: [
            "Id",
            "EventId",
            "EventDesignation",
            "PersonId",
            "Status",
          ].join(","),
        },
      })
      .pipe(switchMap(decodeArray(Subscription)));
  }

  getSubscriptionDetailsById(
    id: number,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(SubscriptionDetail)));
  }
}
