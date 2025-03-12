import { Injectable, inject } from "@angular/core";
import uniq from "lodash-es/uniq";
import { firstValueFrom } from "rxjs";
import { PersonSummary } from "src/app/shared/models/person.model";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { toHash } from "../../utils/common/array";
import { isNumber } from "../../utils/common/validation";
import { EmailValidationError } from "../../utils/emails/error";
import {
  EmailImportEntryValidationFn,
  assertPersonExists,
  assertValidPersonEmail,
  assertValidPersonId,
} from "../../utils/emails/validation";
import { ImportEntry } from "../common/import-state.service";
import { EmailEntry } from "./import-file-emails.service";

export type EmailImportEntry = ImportEntry<
  EmailEntry,
  {
    person?: PersonSummary;
  },
  EmailValidationError
>;

@Injectable({
  providedIn: "root",
})
export class ImportValidateEmailsService {
  private personsService = inject(PersonsRestService);

  async fetchAndValidate(
    parsedEntries: ReadonlyArray<EmailEntry>,
  ): Promise<ReadonlyArray<EmailImportEntry>> {
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
  private verifyEntriesData(entries: ReadonlyArray<EmailImportEntry>): void {
    entries.forEach((entry) => this.verifyEntryData(entry));
  }

  private verifyEntryData(entry: EmailImportEntry): void {
    const assertions: ReadonlyArray<EmailImportEntryValidationFn> = [
      assertValidPersonId,
      assertValidPersonEmail,
    ];
    for (const assert of assertions) {
      const valid = assert(entry);
      if (!valid) {
        return;
      }
    }
  }

  private validateEntries(entries: ReadonlyArray<EmailImportEntry>) {
    entries.forEach(this.validateEntry.bind(this));
  }

  private validateEntry(entry: EmailImportEntry): void {
    if (entry.validationStatus !== "validating") return;

    const assertions: ReadonlyArray<EmailImportEntryValidationFn> = [
      assertPersonExists,
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
    entries: ReadonlyArray<EmailImportEntry>,
  ): Promise<void> {
    await this.decoratePersonsById(entries);
  }

  private async decoratePersonsById(
    entries: ReadonlyArray<EmailImportEntry>,
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
  private getPersonIds(
    entries: ReadonlyArray<EmailImportEntry>,
  ): ReadonlyArray<number> {
    return uniq(
      entries
        .filter(
          ({ validationStatus }) =>
            // Don't fetch persons for invalid entries
            validationStatus !== "invalid",
        )
        .map(({ entry: { personId } }) => personId),
    )
      .filter(isNumber)
      .map(Number);
  }

  private loadPersonsById(
    personIds: ReadonlyArray<number>,
  ): Promise<ReadonlyArray<PersonSummary>> {
    return firstValueFrom(this.personsService.getSummaries(personIds));
  }

  private buildValidationEntries(
    entries: ReadonlyArray<EmailEntry>,
  ): ReadonlyArray<EmailImportEntry> {
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
