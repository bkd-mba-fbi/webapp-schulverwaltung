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

export interface InvalidEventIdError extends ValidationError {
  type: "invalidEventIdError";
}

export interface InvalidPersonIdError extends ValidationError {
  type: "invalidPersonIdError";
}

export interface InvalidEmailError extends ValidationError {
  type: "invalidEmailError";
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export interface MissingPersonIdEmailError extends ValidationError {
  type: "missingPersonIdEmailError";
}

export interface InvalidSubscriptionDetailIdError extends ValidationError {
  type: "invalidSubscriptionDetailIdError";
}

/**
 * "Wert" is empty.
 */
export interface MissingValueError extends ValidationError {
  type: "missingValueError";
}

export interface EventNotFoundError extends ValidationError {
  type: "eventNotFoundError";
}

export interface PersonNotFoundError extends ValidationError {
  type: "personNotFoundError";
}

export interface SubscriptionDetailNotFoundError extends ValidationError {
  type: "subscriptionDetailNotFoundError";
}

/**
 * The subscription detail does not support editing via the internet.
 */
export interface SubscriptionDetailUnsupportedError extends ValidationError {
  type: "subscriptionDetailUnsupportedError";
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export interface InvalidValueError extends ValidationError {
  type: "invalidValueError";
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export interface InvalidDropdownValueError extends ValidationError {
  type: "invalidDropdownValueError";
}

export type SubscriptionDetailValidationError =
  | InvalidEventIdError
  | InvalidPersonIdError
  | InvalidEmailError
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
  ValidationError,
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
    const entries = this.buildValidationEntries(parsedEntries);

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

    // entries = this.checkTypes(entries);

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
  }

  /**
   * Verifies whether the given row date of the entries is valid (IDs must be numbers etc.)
   */
  private checkTypes(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<SubscriptionDetailImportEntry> {
    // TODO: check types of entry values and set status/errors if invalid:
    // - Event IDs and Subscription IDs must be numbers
    // - Person IDs must be number or nothing
    // - Email must be a valid email or nothing
    // - Either Person ID or Email must be available
    return entries;
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

  // protected verifyTypes(rows: ReadonlyArray<TRow>): Option<InvalidTypesError> {
  //   const invalid = rows.reduce<InvalidTypesError["detail"]>(
  //     (acc, row, i) => [...acc, ...this.verifyTypeForRow(row, i)],
  //     [],
  //   );

  //   if (invalid.length > 0) {
  //     return {
  //       type: "invalidTypes",
  //       detail: invalid,
  //     };
  //   }

  //   return null;
  // }

  // protected verifyTypeForRow(
  //   row: TRow,
  //   index: number,
  // ): InvalidTypesError["detail"] {
  //   return Object.keys(row)
  //     .map((column) => {
  //       const value = row[column];
  //       const availableColumns = Object.keys(this.rowSchema);
  //       const expectedType = this.rowSchema[column];
  //       return availableColumns.includes(column) &&
  //         !this.hasValidType(expectedType, value)
  //         ? {
  //             index,
  //             column,
  //             value,
  //             expectedType,
  //           }
  //         : null;
  //     })
  //     .filter(notNull);
  // }

  // protected hasValidType(type: string, value: unknown): boolean {
  //   switch (type) {
  //     case "number":
  //       return typeof value === "number" || !isNaN(Number(value));
  //     default:
  //       return true;
  //   }
  // }  protected verifyTypes(rows: ReadonlyArray<TRow>): Option<InvalidTypesError> {
  //   const invalid = rows.reduce<InvalidTypesError["detail"]>(
  //     (acc, row, i) => [...acc, ...this.verifyTypeForRow(row, i)],
  //     [],
  //   );

  //   if (invalid.length > 0) {
  //     return {
  //       type: "invalidTypes",
  //       detail: invalid,
  //     };
  //   }

  //   return null;
  // }

  // protected verifyTypeForRow(
  //   row: TRow,
  //   index: number,
  // ): InvalidTypesError["detail"] {
  //   return Object.keys(row)
  //     .map((column) => {
  //       const value = row[column];
  //       const availableColumns = Object.keys(this.rowSchema);
  //       const expectedType = this.rowSchema[column];
  //       return availableColumns.includes(column) &&
  //         !this.hasValidType(expectedType, value)
  //         ? {
  //             index,
  //             column,
  //             value,
  //             expectedType,
  //           }
  //         : null;
  //     })
  //     .filter(notNull);
  // }

  // protected hasValidType(type: string, value: unknown): boolean {
  //   switch (type) {
  //     case "number":
  //       return typeof value === "number" || !isNaN(Number(value));
  //     default:
  //       return true;
  //   }
  // }
}
