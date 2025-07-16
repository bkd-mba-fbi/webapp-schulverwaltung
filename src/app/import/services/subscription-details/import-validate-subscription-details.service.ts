import { Injectable, inject } from "@angular/core";
import uniq from "lodash-es/uniq";
import { firstValueFrom, tap } from "rxjs";
import { EventDesignation } from "src/app/shared/models/event.model";
import {
  PersonFullName,
  PersonSummary,
} from "src/app/shared/models/person.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import {
  catch404,
  executeWithMaxConcurrency,
} from "src/app/shared/utils/observable";
import { EventsRestService } from "../../../shared/services/events-rest.service";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";
import { toHash } from "../../utils/common/array";
import { isEmail, isNumber } from "../../utils/common/validation";
import { SubscriptionDetailValidationError } from "../../utils/subscription-details/error";
import {
  SubscriptionDetailValidationFn,
  assertEventExists,
  assertPersonExists,
  assertPersonIdEmailPresent,
  assertSubscriptionDetailDropdownItems,
  assertSubscriptionDetailEditable,
  assertSubscriptionDetailExists,
  assertSubscriptionDetailType,
  assertValidEventId,
  assertValidPersonEmail,
  assertValidPersonId,
  assertValidSubscriptionDetailId,
  assertValuePresent,
} from "../../utils/subscription-details/validation";
import { ImportEntry } from "../common/import-state.service";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";

const MAX_CONCURRENT_REQUESTS = 20;

export type SubscriptionDetailImportEntry = ImportEntry<
  SubscriptionDetailEntry,
  {
    event?: EventDesignation;
    person?: PersonFullName;
    subscriptionDetail?: SubscriptionDetail;
  },
  SubscriptionDetailValidationError
>;

@Injectable({
  providedIn: "root",
})
export class ImportValidateSubscriptionDetailsService {
  private eventsService = inject(EventsRestService);
  private personsService = inject(PersonsRestService);
  private subscriptionsService = inject(SubscriptionsRestService);

  async fetchAndValidate(
    parsedEntries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Promise<ReadonlyArray<SubscriptionDetailImportEntry>> {
    const entries = this.buildValidationEntries(parsedEntries);

    // Perform basic verification of the Excel data
    this.verifyEntriesData(entries);

    // Fetch data & validate
    await this.loadData(entries);
    this.validateEntries(entries);

    return entries;
  }

  /**
   * Verifies whether the given row data of the entries is valid
   */
  private verifyEntriesData(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): void {
    entries.forEach((entry) => this.verifyEntryData(entry));
  }

  private verifyEntryData(entry: SubscriptionDetailImportEntry): void {
    const assertions: ReadonlyArray<SubscriptionDetailValidationFn> = [
      assertValidEventId,
      assertValidPersonId,
      assertValidPersonEmail,
      assertPersonIdEmailPresent,
      assertValidSubscriptionDetailId,
      assertValuePresent,
    ];
    for (const assert of assertions) {
      const valid = assert(entry);
      if (!valid) {
        return;
      }
    }
  }

  private validateEntries(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ) {
    entries.forEach(this.validateEntry.bind(this));
  }

  private validateEntry(entry: SubscriptionDetailImportEntry): void {
    if (entry.validationStatus !== "validating") return;

    const assertions: ReadonlyArray<SubscriptionDetailValidationFn> = [
      assertEventExists,
      assertPersonExists,
      assertSubscriptionDetailExists,
      assertSubscriptionDetailEditable,
      assertSubscriptionDetailType,
      assertSubscriptionDetailDropdownItems,
    ];
    for (const assert of assertions) {
      const valid = assert(entry);
      if (!valid) {
        return;
      }
    }
    entry.validationStatus = "valid";
  }

  private async loadData(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    await Promise.all([
      this.decorateEvents(entries),
      this.decoratePersonsById(entries),
    ]);
    await this.decoratePersonsByEmail(entries);
    await this.decorateSubscriptionsDetails(entries);
  }

  private async decorateEvents(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const events = await this.loadEvents(this.getEventIds(entries));
    const eventsById = toHash(events);
    entries.forEach((entry) => {
      if (isNumber(entry.entry.eventId)) {
        entry.data.event = eventsById[entry.entry.eventId] ?? null;
      }
      return entry;
    });
  }

  private async decoratePersonsById(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const persons = await this.loadPersonsById(this.getPersonIds(entries));
    const personsById = toHash(persons);
    entries.forEach((entry) => {
      if (!entry.data.person && isNumber(entry.entry.personId)) {
        entry.data.person = personsById[entry.entry.personId] ?? null;
      }
      return entry;
    });
  }

  private async decoratePersonsByEmail(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const persons = await this.loadPersonsByEmail(
      this.getPersonEmails(entries),
    );
    const personsByEmail = toHash(persons, (p) => p.DisplayEmail ?? "");
    entries.forEach((entry) => {
      if (!entry.data.person && isEmail(entry.entry.personEmail)) {
        entry.data.person = personsByEmail[entry.entry.personEmail] ?? null;
      }
      return entry;
    });
  }

  private async decorateSubscriptionsDetails(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const personIdsByEvent = this.getPersonIdsGroupedByEvent(entries);
    await Promise.all(
      personIdsByEvent.map(({ eventId, personIds }) =>
        this.decorateSubscriptionDetail(eventId, personIds, entries),
      ),
    );
  }

  private async decorateSubscriptionDetail(
    eventId: number,
    personIds: ReadonlyArray<number>,
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const subscriptionIds = await firstValueFrom(
      this.subscriptionsService.getSubscriptionIdsByEventAndStudents(
        eventId,
        personIds,
      ),
    );

    await firstValueFrom(
      executeWithMaxConcurrency(
        subscriptionIds,
        (id) =>
          this.subscriptionsService.getSubscriptionDetailsById(id).pipe(
            catch404(null), // Should actually not happen, since we only fetch for subscriptions that exist?
            tap((details: Option<ReadonlyArray<SubscriptionDetail>>) => {
              if (details !== null) {
                entries.forEach((entry) => {
                  const { subscriptionDetailId: detailId } = entry.entry;
                  const eventId = entry.data.event?.Id;
                  const personId = entry.data.person?.Id;
                  const detail =
                    eventId &&
                    personId &&
                    isNumber(detailId) &&
                    details.find(
                      (detail) =>
                        detail.VssId === detailId &&
                        detail.EventId === eventId &&
                        detail.IdPerson === personId,
                    );
                  if (detail) {
                    entry.data.subscriptionDetail = detail;
                  }
                });
              }
            }),
          ),
        MAX_CONCURRENT_REQUESTS,
      ),
    );
  }

  private getEventIds(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<number> {
    return uniq(
      entries
        .filter(({ validationStatus }) => validationStatus !== "invalid")
        .map(({ entry: { eventId } }) => eventId),
    )
      .filter(isNumber)
      .map(Number);
  }

  private getPersonIds(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<number> {
    return uniq(
      entries
        .filter(
          ({ validationStatus, data: { person } }) =>
            // Don't fetch persons for invalid entries or entries that already have a person
            validationStatus !== "invalid" && !person,
        )
        .map(({ entry: { personId } }) => personId),
    )
      .filter(isNumber)
      .map(Number);
  }

  private getPersonEmails(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<string> {
    return uniq(
      entries
        .filter(
          ({ validationStatus, data: { person } }) =>
            // Don't fetch persons for invalid entries or entries that already have a person
            validationStatus !== "invalid" && !person,
        )
        .map(({ entry: { personEmail } }) => personEmail),
    ).filter(isEmail);
  }

  private getPersonIdsGroupedByEvent(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<{ eventId: number; personIds: ReadonlyArray<number> }> {
    const grouped = entries.reduce<Dict<number[]>>(
      (acc, { validationStatus, data: { event, person } }) => {
        if (validationStatus !== "invalid" && event && person) {
          if (!acc[event.Id]) {
            acc[event.Id] = [];
          }
          acc[event.Id].push(person.Id);
        }
        return acc;
      },
      {},
    );
    return Object.keys(grouped).map((eventId) => ({
      eventId: Number(eventId),
      personIds: uniq(grouped[eventId]),
    }));
  }

  private loadEvents(
    eventIds: ReadonlyArray<number>,
  ): Promise<ReadonlyArray<EventDesignation>> {
    return firstValueFrom(this.eventsService.getEventDesignations(eventIds));
  }

  private loadPersonsById(
    personIds: ReadonlyArray<number>,
  ): Promise<ReadonlyArray<PersonFullName>> {
    return firstValueFrom(this.personsService.getFullNamesById(personIds));
  }

  private loadPersonsByEmail(
    personEmails: ReadonlyArray<string>,
  ): Promise<ReadonlyArray<PersonSummary>> {
    return firstValueFrom(
      this.personsService.getSummariesByEmail(personEmails),
    );
  }

  private buildValidationEntries(
    entries: ReadonlyArray<SubscriptionDetailEntry>,
  ): ReadonlyArray<SubscriptionDetailImportEntry> {
    return entries.map((entry) => ({
      validationStatus: "validating",
      importStatus: null,
      entry,
      data: {},
      validationError: null,
      importError: null,
    }));
  }
}
