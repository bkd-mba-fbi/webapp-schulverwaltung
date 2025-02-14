import { Injectable, inject } from "@angular/core";
import uniq from "lodash-es/uniq";
import uniqBy from "lodash-es/uniqBy";
import {
  Observable,
  combineLatest,
  firstValueFrom,
  map,
  switchMap,
} from "rxjs";
import { EventSummary } from "src/app/shared/models/event.model";
import { PersonSummary } from "src/app/shared/models/person.model";
import {
  Subscription,
  SubscriptionDetail,
} from "src/app/shared/models/subscription.model";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import { SubscriptionDetailEntry } from "./import-parse-subscription-details.service";

export type MissingEventError = {
  type: "missingEventError";
  detail: {
    index: number;
    column?: string;
    eventId: number;
  };
};

export type MissingPersonError = {
  type: "missingPersonError";
  detail: {
    index: number;
    column?: string;
    personId: number;
    email: string;
  };
};

export type ValidationError = MissingPersonError;

export type ValidationEntry = {
  entry: SubscriptionDetailEntry;
  additionalData: {
    event?: EventSummary;
    person?: PersonSummary;
    subscription?: Subscription;
    subscriptionDetail?: SubscriptionDetail;
  };
  errors: Option<ReadonlyArray<ValidationError>>;
};

@Injectable({
  providedIn: "root",
})
export class ImportValidateSubscriptionDetailsService {
  private eventsService = inject(EventsRestService);
  private personsService = inject(PersonsRestService);
  private subscriptionsService = inject(SubscriptionsRestService);

  async fetchAndValidate(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Promise<ReadonlyArray<ValidationEntry>> {
    const entriesWithAdditionalData = await firstValueFrom(
      combineLatest([
        this.loadEvents(entries),
        this.loadPersonsById(entries),
        this.loadSubscriptionsAndDetails(entries),
      ]).pipe(
        map(([events, persons, { subscriptions, subscriptionDetails }]) =>
          this.buildValidationEntries(
            entries,
            events,
            persons,
            subscriptions,
            subscriptionDetails,
          ),
        ),
      ),
    );

    // TODO: Validate

    return entriesWithAdditionalData;
  }

  private loadEvents(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Observable<ReadonlyArray<EventSummary>> {
    const eventIds = entries.map(({ eventId }) => eventId);
    return this.eventsService.getEventSummaries(eventIds);
  }

  private loadPersonsById(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Observable<ReadonlyArray<PersonSummary>> {
    const personIds = entries.map(({ personId }) => personId);
    return this.personsService.getSummaries(personIds);
  }

  private loadSubscriptionsAndDetails(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Observable<{
    subscriptions: ReadonlyArray<{
      eventId: number;
      personId: number;
      subscriptionId: number;
    }>;
    subscriptionDetails: ReadonlyArray<SubscriptionDetail>;
  }> {
    return this.loadSubscriptions(entries).pipe(
      switchMap((subscriptions) =>
        this.loadSubscriptionDetails(subscriptions).pipe(
          map((subscriptionDetails) => ({
            subscriptions,
            subscriptionDetails,
          })),
        ),
      ),
    );
  }

  private loadSubscriptions(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Observable<
    ReadonlyArray<{ eventId: number; personId: number; subscriptionId: number }>
  > {
    const eventPersonIds = uniqBy(
      entries.map(({ personId, eventId }) => ({ personId, eventId })),
      ({ personId, eventId }) => `${personId}-${eventId}`,
    );
    return combineLatest(
      eventPersonIds.map(({ personId, eventId }) =>
        this.subscriptionsService
          .getSubscriptionIdsByStudentAndCourse(personId, [eventId])
          .pipe(map((ids) => ({ eventId, personId, subscriptionId: ids[0] }))),
      ),
    );
  }

  private loadSubscriptionDetails(
    subscriptions: ReadonlyArray<{ eventId: number; subscriptionId: number }>,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    const subscriptionDetailIds = uniq(
      subscriptions.map(
        ({ eventId, subscriptionId }) => `${eventId}_${subscriptionId}`,
      ),
    );
    // TODO: catch404
    return combineLatest(
      subscriptionDetailIds.map((id) =>
        this.subscriptionsService
          .getSubscriptionDetailsById(id)
          .pipe(map((details) => details[0])),
      ),
    );
  }

  private buildValidationEntries(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
    events: ReadonlyArray<EventSummary>,
    persons: ReadonlyArray<PersonSummary>,
    subscriptions: ReadonlyArray<{
      eventId: number;
      personId: number;
      subscriptionId: number;
    }>,
    subscriptionDetails: ReadonlyArray<SubscriptionDetail>,
  ): ReadonlyArray<ValidationEntry> {
    return entries.map((entry) => {
      const subscriptionId = subscriptions.find(
        (s) => s.eventId === entry.eventId && s.personId === entry.personId,
      )?.subscriptionId;
      return {
        entry,
        additionalData: {
          event: events.find((e) => e.Id === entry.eventId),
          person: persons.find((p) => p.Id === entry.personId),
          subscriptionId: subscriptionId,
          subscriptionDetail: subscriptionId
            ? subscriptionDetails.find(
                (s) =>
                  s.EventId === entry.eventId &&
                  s.IdPerson === entry.personId &&
                  s.SubscriptionId === subscriptionId,
              )
            : [],
        },
        errors: null,
      };
    });
  }
}
