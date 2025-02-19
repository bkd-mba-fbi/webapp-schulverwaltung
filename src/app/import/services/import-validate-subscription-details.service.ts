import { Injectable, Signal, WritableSignal, signal } from "@angular/core";
import { EventSummary } from "src/app/shared/models/event.model";
import { PersonSummary } from "src/app/shared/models/person.model";
import {
  Subscription,
  SubscriptionDetail,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailEntry } from "./import-parse-subscription-details.service";
import { ImportEntry, ValidationError } from "./import-state.service";

export type ValidationProgress = {
  validating: number;
  valid: number;
  invalid: number;
  total: number;
};

export class InvalidEventIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidEventIdError";
    this.columns = ["eventId"];
  }
}

export class InvalidPersonIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidPersonIdError";
    this.columns = ["personId"];
  }
}

export class InvalidPersonEmailError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidPersonEmailError";
    this.columns = ["personEmail"];
  }
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export class MissingPersonIdEmailError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "missingPersonIdEmailError";
    this.columns = ["personId", "personEmail"];
  }
}

export class InvalidSubscriptionDetailIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidSubscriptionDetailIdError";
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * "Wert" is empty.
 */
export class MissingValueError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "missingValueError";
    this.columns = ["value"];
  }
}

export class EventNotFoundError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "eventNotFoundError";
    this.columns = ["eventId"];
  }
}

export class PersonNotFoundError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "personNotFoundError";
    this.columns = ["personId", "personEmail"];
  }
}

export class SubscriptionDetailNotFoundError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "subscriptionDetailNotFoundError";
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail does not support editing via the internet.
 */
export class SubscriptionDetailUnsupportedError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "subscriptionDetailUnsupportedError";
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export class InvalidValueError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidValueError";
    this.columns = ["value"];
  }
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export class InvalidDropdownValueError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.type = "invalidDropdownValueError";
    this.columns = ["value"];
  }
}

export type SubscriptionDetailValidationError =
  | InvalidEventIdError
  | InvalidPersonIdError
  | InvalidPersonEmailError
  | MissingPersonIdEmailError
  | InvalidSubscriptionDetailIdError
  | MissingValueError
  | EventNotFoundError
  | PersonNotFoundError
  | SubscriptionDetailNotFoundError
  | SubscriptionDetailUnsupportedError
  | InvalidValueError
  | InvalidDropdownValueError;

/**
 * Errors bei Subscription Detail Import:
 *
 * invalidEventId
 * invalidPersonId
 * invalidEmail
 * missingPersonIdEmailError → weder Person ID noch E-Mail
 * invalidSubscriptionDetailId
 * missingValue → kein Wert
 * eventNotFoundError
 * personNotFoundError
 * subscriptionDetailNotFoundError (keine Anmeldung auf Anlass)
 * (keine Internetfreigabe)
 * invalidValueError → SubscriptionDetail Value entspricht nicht VssType
 * invalidDropdownValueError
 */

/**
 * Errors bei Email Import:
 *
 * invalidPersonId
 * invalidEmail
 * personNotFoundError
 */

export type SubscriptionDetailImportEntry = ImportEntry<
  SubscriptionDetailEntry,
  {
    event?: EventSummary;
    person?: PersonSummary;
    subscription?: Subscription;
    subscriptionDetail?: SubscriptionDetail;
  },
  SubscriptionDetailValidationError,
  unknown
>;

@Injectable({
  providedIn: "root",
})
export class ImportValidateSubscriptionDetailsService {
  // private eventsService = inject(EventsRestService);
  // private personsService = inject(PersonsRestService);
  // private subscriptionsService = inject(SubscriptionsRestService);

  fetchAndValidate(parsedEntries: ReadonlyArray<SubscriptionDetailEntry>): {
    progress: Signal<ValidationProgress>;
    entries: Promise<ReadonlyArray<SubscriptionDetailImportEntry>>;
  } {
    const progress = signal<ValidationProgress>({
      validating: parsedEntries.length,
      valid: 0,
      invalid: 0,
      total: parsedEntries.length,
    });
    return {
      progress,
      entries: this.getValidationResult(progress, parsedEntries),
    };
  }

  private getValidationResult(
    progress: WritableSignal<ValidationProgress>,
    parsedEntries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Promise<ReadonlyArray<SubscriptionDetailImportEntry>> {
    let entries = this.buildValidationEntries(parsedEntries);
    entries = this.verifyEntriesData(entries);
    // return Promise.resolve(entries);

    // TODO:
    // - Load events
    // - Load persons by ID
    // - Load persons by Email
    // - Load subscriptions with subscription details
    // - Validate
    //   - Does event exist?
    //   - Does person exist (either by ID or by email)?
    //   - Does subscription exist?
    //   - Is subscription detail available for editing throught internet → "VssInternet": "E" && "VssStyle": "TX"
    //   - Subscription detail type:
    //     vssType: {
    //       IntField: 277,
    //       Text: 290,
    //       MemoText: 293,
    //       Currency: 279
    //     }
    //   - Are dropdown items allowed (and valid)? → DropdownItems != null

    // const entriesWithAdditionalData = await firstValueFrom(
    //   combineLatest([
    //     this.loadEvents(entries),
    //     this.loadPersonsById(entries),
    //     this.loadSubscriptionsAndDetails(entries),
    //   ]).pipe(
    //     map(([events, persons, { subscriptions, subscriptionDetails }]) =>
    //       this.buildValidationEntries(
    //         entries,
    //         events,
    //         persons,
    //         subscriptions,
    //         subscriptionDetails,
    //       ),
    //     ),
    //   ),
    // );

    // TODO: Fake implementation for now
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        entries[i].validationStatus = "valid";
        progress.update(({ validating, valid, invalid, total }) => ({
          validating: validating - 1,
          valid: valid + 1,
          invalid,
          total,
        }));

        i += 1;
        if (i === entries.length) {
          clearInterval(interval);
          resolve(entries);
        }
      }, 250);
    });
  }

  /**
   * Verifies whether the given row data of the entries is valid
   */
  private verifyEntriesData(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<SubscriptionDetailImportEntry> {
    return entries.map((entry) => this.verifyEntryData(entry));
  }

  verifyEntryData(
    entry: SubscriptionDetailImportEntry,
  ): SubscriptionDetailImportEntry {
    const assertions: ReadonlyArray<EntryDataValidationFn> = [
      assertValidEventId,
      assertValidPersonId,
      assertValidPersonEmail,
      assertPersonIdEmailPresent,
      assertValidSubscriptionDetailId,
      assertValuePresent,
    ];
    for (const assert of assertions) {
      const result = assert(entry);
      if (!result.valid) {
        return result.entry;
      }
    }
    return entry;
  }

  // private loadEvents(
  //   entries: ReadonlyArray<SubscriptionDetailEntry>,
  // ): Observable<ReadonlyArray<EventSummary>> {
  //   const eventIds = entries.map(({ eventId }) => eventId);
  //   return this.eventsService.getEventSummaries(eventIds);
  // }

  // private loadPersonsById(
  //   entries: ReadonlyArray<SubscriptionDetailEntry>,
  // ): Observable<ReadonlyArray<PersonSummary>> {
  //   const personIds = entries.map(({ personId }) => personId);
  //   return this.personsService.getSummaries(personIds);
  // }

  // private loadSubscriptionsAndDetails(
  //   entries: ReadonlyArray<SubscriptionDetailEntry>,
  // ): Observable<{
  //   subscriptions: ReadonlyArray<{
  //     eventId: number;
  //     personId: number;
  //     subscriptionId: number;
  //   }>;
  //   subscriptionDetails: ReadonlyArray<SubscriptionDetail>;
  // }> {
  //   return this.loadSubscriptions(entries).pipe(
  //     switchMap((subscriptions) =>
  //       this.loadSubscriptionDetails(subscriptions).pipe(
  //         map((subscriptionDetails) => ({
  //           subscriptions,
  //           subscriptionDetails,
  //         })),
  //       ),
  //     ),
  //   );
  // }

  // private loadSubscriptions(
  //   entries: ReadonlyArray<SubscriptionDetailEntry>,
  // ): Observable<
  //   ReadonlyArray<{ eventId: number; personId: number; subscriptionId: number }>
  // > {
  //   const eventPersonIds = uniqBy(
  //     entries.map(({ personId, eventId }) => ({ personId, eventId })),
  //     ({ personId, eventId }) => `${personId}-${eventId}`,
  //   );
  //   return combineLatest(
  //     eventPersonIds.map(({ personId, eventId }) =>
  //       this.subscriptionsService
  //         .getSubscriptionIdsByStudentAndCourse(personId, [eventId])
  //         .pipe(map((ids) => ({ eventId, personId, subscriptionId: ids[0] }))),
  //     ),
  //   );
  // }

  // private loadSubscriptionDetails(
  //   subscriptions: ReadonlyArray<{ eventId: number; subscriptionId: number }>,
  // ): Observable<ReadonlyArray<SubscriptionDetail>> {
  //   const subscriptionDetailIds = uniq(
  //     subscriptions.map(
  //       ({ eventId, subscriptionId }) => `${eventId}_${subscriptionId}`,
  //     ),
  //   );
  //   // TODO: catch404
  //   return combineLatest(
  //     subscriptionDetailIds.map((id) =>
  //       this.subscriptionsService
  //         .getSubscriptionDetailsById(id)
  //         .pipe(map((details) => details[0])),
  //     ),
  //   );
  // }

  // private buildValidationEntries(
  //   entries: ReadonlyArray<SubscriptionDetailEntry>,
  //   events: ReadonlyArray<EventSummary>,
  //   persons: ReadonlyArray<PersonSummary>,
  //   subscriptions: ReadonlyArray<{
  //     eventId: number;
  //     personId: number;
  //     subscriptionId: number;
  //   }>,
  //   subscriptionDetails: ReadonlyArray<SubscriptionDetail>,
  // ): ReadonlyArray<SubscriptionDetailImportEntry> {
  //   return entries.map((entry) => {
  //     const subscriptionId = subscriptions.find(
  //       (s) => s.eventId === entry.eventId && s.personId === entry.personId,
  //     )?.subscriptionId;
  //     return {
  //       status: signal<ValidationStatus>("validating"),
  //       entry,
  //       additionalData: {
  //         event: events.find((e) => e.Id === entry.eventId),
  //         person: persons.find((p) => p.Id === entry.personId),
  //         subscriptionId: subscriptionId,
  //         subscriptionDetail: subscriptionId
  //           ? subscriptionDetails.find(
  //               (s) =>
  //                 s.EventId === entry.eventId &&
  //                 s.IdPerson === entry.personId &&
  //                 s.SubscriptionId === subscriptionId,
  //             )
  //           : [],
  //       },
  //       errors: null,
  //     };
  //   });
  // }

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

type EntryDataValidationFn = (entry: SubscriptionDetailImportEntry) => {
  valid: boolean;
  entry: SubscriptionDetailImportEntry;
};

const assertValidEventId: EntryDataValidationFn = (entry) => {
  const valid = isNumber(entry.entry.eventId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidEventIdError();
  }
  return { valid, entry };
};

const assertValidPersonId: EntryDataValidationFn = (entry) => {
  const valid = isOptionalNumber(entry.entry.personId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonIdError();
  }
  return { valid, entry };
};

const assertValidPersonEmail: EntryDataValidationFn = (entry) => {
  const valid = isOptionalEmail(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonEmailError();
  }
  return { valid, entry };
};

const assertPersonIdEmailPresent: EntryDataValidationFn = (entry) => {
  const valid =
    isPresent(entry.entry.personId) || isPresent(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingPersonIdEmailError();
  }
  return { valid, entry };
};

const assertValidSubscriptionDetailId: EntryDataValidationFn = (entry) => {
  const valid = isNumber(entry.entry.subscriptionDetailId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidSubscriptionDetailIdError();
  }
  return { valid, entry };
};

const assertValuePresent: EntryDataValidationFn = (entry) => {
  const valid = isPresent(entry.entry.value);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingValueError();
  }
  return { valid, entry };
};

function isPresent(value: unknown): boolean {
  return value != null && value !== "";
}

function isNumber(value: unknown): boolean {
  return typeof value === "number" && !isNaN(value);
}

function isOptionalNumber(value: unknown): boolean {
  return !isPresent(value) || isNumber(value);
}

function isEmail(value: unknown): boolean {
  return typeof value === "string" && value.includes("@");
}

function isOptionalEmail(value: unknown): boolean {
  return !isPresent(value) || isEmail(value);
}
