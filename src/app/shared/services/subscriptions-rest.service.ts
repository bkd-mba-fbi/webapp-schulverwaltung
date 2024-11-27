import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Identifiable } from "../models/common-types";
import { Subscription } from "../models/subscription.model";
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
    return this.getList({
      params: {
        "filter.PersonId": `=${personId}`,
        "filter.EventId": `;${eventIds}`,
      },
    }).pipe(
      switchMap(decodeArray(Identifiable)),
      map((result) => result.map((i) => i.Id)),
    );
  }

  getSubscriptionsByCourse(
    eventId: number,
    additionalParams?: Dict<string>,
  ): Observable<ReadonlyArray<Subscription>> {
    return this.getList({
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
    }).pipe(switchMap(decodeArray(Subscription)));
  }
}
