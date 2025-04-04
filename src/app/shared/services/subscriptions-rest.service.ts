import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
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
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, Subscription, "Subscriptions");
  }

  getSubscriptionIdsByStudentAndCourse(
    personId: number,
    eventIds: ReadonlyArray<number>,
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

  getSubscriptionIdsByEventAndStudents(
    eventId: number,
    personIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<number>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.EventId": `=${eventId}`,
          "filter.PersonId": `;${personIds}`,
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
            "RegistrationDate",
          ].join(","),
        },
      })
      .pipe(switchMap(decodeArray(Subscription)));
  }

  /**
   * This endpoint only returns subscription details that have VssInternet="E"
   * (i.e. editable via Internet).
   */
  getSubscriptionDetailsById(
    id: number | string,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(SubscriptionDetail)));
  }
}
