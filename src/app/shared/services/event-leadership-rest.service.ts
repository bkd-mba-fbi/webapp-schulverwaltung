import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { EventLeadership } from "../models/event-leadership.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class EventLeadershipRestService extends RestService<
  typeof EventLeadership
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, EventLeadership, "EventLeaderships");
  }

  /**
   * This request only works with 'NG' scope. To test use a token with this
   * scope.
   */
  getLeadershipsForPersonAndEvents(
    personId: number,
    eventIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<EventLeadership>> {
    return super.getList({
      params: {
        "filter.PersonId": `=${personId}`,
        "filter.EventId": `;${eventIds.join(";")}`,
      },
    });
  }
}
