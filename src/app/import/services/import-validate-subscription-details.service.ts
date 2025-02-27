import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import groupBy from "lodash-es/groupBy";
import uniq from "lodash-es/uniq";
import { Observable, firstValueFrom, from, mergeMap, tap, toArray } from "rxjs";
import { EventDesignation } from "src/app/shared/models/event.model";
import {
  PersonFullName,
  PersonSummary,
} from "src/app/shared/models/person.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import { catch404 } from "src/app/shared/utils/observable";
import { EventsRestService } from "../../shared/services/events-rest.service";
import { PersonsRestService } from "../../shared/services/persons-rest.service";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";
import { ImportEntry, ValidationError } from "./import-state.service";

const MAX_CONCURRENT_REQUESTS = 20;

enum SubscriptionDetailType {
  IntField = 277,
  Currency = 279,
  Text = 290,
  MemoText = 293,
}

export type ValidationProgress = {
  validating: number;
  valid: number;
  invalid: number;
  total: number;
};

/**
 * Errors bei Email Import:
 *
 * invalidPersonId
 * invalidEmail
 * personNotFoundError
 */

export class SubscriptionDetailValidationError extends ValidationError<SubscriptionDetailEntry> {}

export class InvalidEventIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class InvalidPersonIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["personId"];
  }
}

export class InvalidPersonEmailError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["personEmail"];
  }
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export class MissingPersonIdEmailError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class InvalidSubscriptionDetailIdError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * "Wert" is empty.
 */
export class MissingValueError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

export class EventNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class PersonNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class SubscriptionDetailNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail does not support editing via the internet.
 */
export class SubscriptionDetailNotEditableError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export class InvalidValueError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export class InvalidDropdownValueError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

export type SubscriptionDetailImportEntry = ImportEntry<
  SubscriptionDetailEntry,
  {
    event?: EventDesignation;
    person?: PersonFullName;
    subscriptionDetail?: SubscriptionDetail;
  },
  SubscriptionDetailValidationError,
  unknown
>;

@Injectable({
  providedIn: "root",
})
export class ImportValidateSubscriptionDetailsService {
  private eventsService = inject(EventsRestService);
  private personsService = inject(PersonsRestService);
  private subscriptionsService = inject(SubscriptionsRestService);

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

  private async getValidationResult(
    progress: WritableSignal<ValidationProgress>,
    parsedEntries: ReadonlyArray<SubscriptionDetailEntry>,
  ): Promise<ReadonlyArray<SubscriptionDetailImportEntry>> {
    let entries = this.buildValidationEntries(parsedEntries);

    // Perform basic verification of the Excel data
    entries = this.verifyEntriesData(entries);
    this.updateProgress(entries, progress);

    // Fetch data & validate
    await this.loadData(entries);
    this.validateEntries(entries);
    this.updateProgress(entries, progress);

    return entries;
  }

  private updateProgress(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
    progress: WritableSignal<ValidationProgress>,
  ): WritableSignal<ValidationProgress> {
    progress.update(({ total }) => ({
      validating: entries.filter(
        ({ validationStatus }) => validationStatus === "validating",
      ).length,
      valid: entries.filter(
        ({ validationStatus }) => validationStatus === "valid",
      ).length,
      invalid: entries.filter(
        ({ validationStatus }) => validationStatus === "invalid",
      ).length,
      total,
    }));
    return progress;
  }

  /**
   * Verifies whether the given row data of the entries is valid
   */
  private verifyEntriesData(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<SubscriptionDetailImportEntry> {
    return entries.map((entry) => this.verifyEntryData(entry));
  }

  private verifyEntryData(
    entry: SubscriptionDetailImportEntry,
  ): SubscriptionDetailImportEntry {
    const assertions: ReadonlyArray<EntryValidationFn> = [
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

  private validateEntries(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ) {
    entries.forEach(this.validateEntry.bind(this));
  }

  private validateEntry(entry: SubscriptionDetailImportEntry): void {
    if (entry.validationStatus !== "validating") return;

    const assertions: ReadonlyArray<EntryValidationFn> = [
      assertEventExists,
      assertPersonExists,
      assertSubscriptionDetailExists,
      assertSubscriptionDetailEditable,
      assertSubscriptionDetailType,
      assertSubscriptionDetailDropdownItems,
    ];
    for (const assert of assertions) {
      const { valid } = assert(entry);
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
    const eventsById = groupBy(events, (event) => event.Id);
    entries.forEach((entry) => {
      if (isNumber(entry.entry.eventId)) {
        entry.data.event =
          (eventsById[entry.entry.eventId] &&
            eventsById[entry.entry.eventId][0]) ??
          null;
      }
      return entry;
    });
  }

  private async decoratePersonsById(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const persons = await this.loadPersonsById(this.getPersonIds(entries));
    const personsById = groupBy(persons, (person) => person.Id);
    entries.forEach((entry) => {
      if (!entry.data.person && isNumber(entry.entry.personId)) {
        entry.data.person =
          (personsById[entry.entry.personId] &&
            personsById[entry.entry.personId][0]) ??
          null;
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
    const personsByEmail = groupBy(persons, (person) => person.Email);
    entries.forEach((entry) => {
      if (!entry.data.person && isNumber(entry.entry.personEmail)) {
        entry.data.person =
          (personsByEmail[entry.entry.personEmail] &&
            personsByEmail[entry.entry.personEmail][0]) ??
          null;
      }
      return entry;
    });
  }

  private async decorateSubscriptionsDetails(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    const personIdsByGroup = this.getPersonIdsGroupedByEvent(entries);
    await Promise.all(
      personIdsByGroup.map(({ eventId, personIds }) =>
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

    await this.executeWithMaxConcurrency(subscriptionIds, (id) =>
      this.subscriptionsService.getSubscriptionDetailsById(id).pipe(
        catch404(null),
        tap((details: Option<ReadonlyArray<SubscriptionDetail>>) => {
          if (details !== null) {
            entries.forEach((entry) => {
              const detailId = entry.entry.subscriptionDetailId;
              const detail =
                isNumber(detailId) &&
                details.find((detail) => detail.VssId === detailId);
              if (detail) {
                entry.data.subscriptionDetail = detail;
              }
            });
          }
        }),
      ),
    );
  }

  private getEventIds(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<number> {
    return uniq(entries.map(({ entry: { eventId } }) => eventId))
      .filter(isNumber)
      .map(Number);
  }

  private getPersonIds(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<number> {
    return uniq(
      entries
        .filter(({ data: { person } }) => !person) // Don't load persons for entries that already have a person
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
        .filter(({ data: { person } }) => !person) // Don't load persons for entries that already have a person
        .map(({ entry: { personEmail } }) => personEmail),
    ).filter(isEmail);
  }

  private getPersonIdsGroupedByEvent(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<{ eventId: number; personIds: ReadonlyArray<number> }> {
    const grouped = entries.reduce<Dict<number[]>>(
      (acc, { data: { event, person } }) => {
        if (event && person) {
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

  private async executeWithMaxConcurrency<T, R>(
    params: ReadonlyArray<T>,
    fn: (param: T) => Observable<R>,
  ): Promise<ReadonlyArray<R>> {
    return firstValueFrom(
      from(params).pipe(
        mergeMap((param) => fn(param), MAX_CONCURRENT_REQUESTS),
        toArray(), // Wait until all inner observables complete & merge result into an array
      ),
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

type EntryValidationFn = (entry: SubscriptionDetailImportEntry) => {
  valid: boolean;
  entry: SubscriptionDetailImportEntry;
};

const assertValidEventId: EntryValidationFn = (entry) => {
  const valid = isNumber(entry.entry.eventId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidEventIdError();
  }
  return { valid, entry };
};

const assertValidPersonId: EntryValidationFn = (entry) => {
  const valid = isOptionalNumber(entry.entry.personId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonIdError();
  }
  return { valid, entry };
};

const assertValidPersonEmail: EntryValidationFn = (entry) => {
  const valid = isOptionalEmail(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonEmailError();
  }
  return { valid, entry };
};

const assertPersonIdEmailPresent: EntryValidationFn = (entry) => {
  const valid =
    isPresent(entry.entry.personId) || isPresent(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingPersonIdEmailError();
  }
  return { valid, entry };
};

const assertValidSubscriptionDetailId: EntryValidationFn = (entry) => {
  const valid = isNumber(entry.entry.subscriptionDetailId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidSubscriptionDetailIdError();
  }
  return { valid, entry };
};

const assertValuePresent: EntryValidationFn = (entry) => {
  const valid = isPresent(entry.entry.value);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingValueError();
  }
  return { valid, entry };
};

const assertEventExists: EntryValidationFn = (entry) => {
  const valid = entry.data.event !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new EventNotFoundError();
  }
  return { valid: true, entry };
};

const assertPersonExists: EntryValidationFn = (entry) => {
  const valid = entry.data.person !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new PersonNotFoundError();
  }
  return { valid: true, entry };
};

const assertSubscriptionDetailExists: EntryValidationFn = (entry) => {
  const valid = entry.data.subscriptionDetail !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new SubscriptionDetailNotFoundError();
  }
  return { valid: true, entry };
};

const assertSubscriptionDetailEditable: EntryValidationFn = (entry) => {
  const detail = entry.data.subscriptionDetail;
  const valid = detail?.VssInternet === "E" && detail?.VssStyle === "TX";
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new SubscriptionDetailNotEditableError();
  }
  return { valid: true, entry };
};

const assertSubscriptionDetailType: EntryValidationFn = (entry) => {
  const typeId = entry.data.subscriptionDetail?.VssTypeId;
  const value = entry.entry.value;
  const valid =
    ((typeId === SubscriptionDetailType.IntField ||
      typeId === SubscriptionDetailType.Currency) &&
      isNumber(value)) ||
    ((typeId === SubscriptionDetailType.Text ||
      typeId === SubscriptionDetailType.MemoText) &&
      isString(value));
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidValueError();
  }
  return { valid: true, entry };
};

const assertSubscriptionDetailDropdownItems: EntryValidationFn = (entry) => {
  // TODO
  //   - Are dropdown items allowed (and valid)? → DropdownItems != null
  return { valid: true, entry };
};

function isPresent(value: unknown): boolean {
  return value != null && value !== "";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isOptionalNumber(value: unknown): boolean {
  return !isPresent(value) || isNumber(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.includes("@");
}

function isOptionalEmail(value: unknown): boolean {
  return !isPresent(value) || isEmail(value);
}
