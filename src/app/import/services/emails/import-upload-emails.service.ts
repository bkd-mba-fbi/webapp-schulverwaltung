import { Injectable, inject, signal } from "@angular/core";
import {
  Observable,
  catchError,
  firstValueFrom,
  map,
  of,
  switchMap,
  throwError,
} from "rxjs";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { executeWithMaxConcurrency } from "src/app/shared/utils/observable";
import { ImportError } from "../common/import-state.service";
import { EmailImportEntry } from "./import-validate-emails.service";

const MAX_CONCURRENT_REQUESTS = 20;

export type UploadProgress = {
  uploading: number;
  success: number;
  error: number;
  total: number;
};

@Injectable({
  providedIn: "root",
})
export class ImportUploadEmailsService {
  progress = signal<UploadProgress>({
    uploading: 0,
    success: 0,
    error: 0,
    total: 0,
  });

  private personsService = inject(PersonsRestService);

  async upload(
    validatedEntries: ReadonlyArray<EmailImportEntry>,
    { retryFailedOnly = false }: { retryFailedOnly?: boolean } = {},
  ): Promise<ReadonlyArray<EmailImportEntry>> {
    let entriesToImport = validatedEntries.filter(
      (entry) => entry.validationStatus === "valid",
    );
    if (retryFailedOnly) {
      entriesToImport = entriesToImport.filter(
        (entry) => entry.importStatus === "error",
      );
    }
    await this.persistEntries(entriesToImport, validatedEntries);
    return [...validatedEntries];
  }

  private async persistEntries(
    entriesToImport: ReadonlyArray<EmailImportEntry>,
    allEntries: ReadonlyArray<EmailImportEntry>,
  ): Promise<void> {
    this.prepare(entriesToImport, allEntries);

    await firstValueFrom(
      executeWithMaxConcurrency(
        entriesToImport,
        this.persistEntry.bind(this),
        MAX_CONCURRENT_REQUESTS,
      ),
    );
  }

  private prepare(
    entries: ReadonlyArray<EmailImportEntry>,
    allEntries: ReadonlyArray<EmailImportEntry>,
  ): void {
    // Mark all entries as "importing"
    entries.forEach((entry) => {
      entry.importStatus = "importing";
      entry.importError = null;
    });

    // Reset the progress
    this.progress.set({
      uploading: entries.length,
      success: allEntries.filter((entry) => entry.importStatus === "success")
        .length,
      error: 0,
      total: allEntries.filter((entry) => entry.validationStatus === "valid")
        .length,
    });
  }

  private persistEntry(entry: EmailImportEntry): Observable<EmailImportEntry> {
    if (entry.entry.personEmail === entry.data.person?.Email) {
      // Ignore entry with an unchanged value
      this.markSuccessEntry(entry);
      return of(entry);
    }

    // Save new value
    return of(entry).pipe(
      switchMap(this.updatePerson.bind(this)),
      map(() => {
        // Handle success
        this.markSuccessEntry(entry);
        return entry;
      }),
      catchError((error) => {
        // Handle error
        this.markErrorEntry(entry, error);
        return of(entry);
      }),
    );
  }

  private updatePerson({
    entry,
    data: { person },
  }: EmailImportEntry): Observable<void> {
    if (!person)
      return throwError(
        () =>
          new Error(`Person not present for entry: ${JSON.stringify(entry)}`),
      );

    // If you want to only simulate the write request when testing the upload,
    // you may uncomment the following (this also causes to randomly fail some
    // of the entries):

    // if (Math.random() > 0.75) {
    //   throw new Error("Random error");
    // }
    // return of(undefined).pipe(delay(500 + (Math.random() - 0.5) * 300));

    return this.personsService.updateEmail(
      Number(entry.personId),
      String(entry.personEmail),
    );
  }

  private markSuccessEntry(entry: EmailImportEntry): void {
    entry.importStatus = "success";
    entry.importError = null;

    this.progress.update(({ uploading, success, ...rest }) => ({
      uploading: uploading - 1,
      success: success + 1,
      ...rest,
    }));
  }

  private markErrorEntry(entry: EmailImportEntry, error: unknown): void {
    entry.importStatus = "error";
    entry.importError = new ImportError(error);

    this.progress.update(({ uploading, error, ...rest }) => ({
      uploading: uploading - 1,
      error: error + 1,
      ...rest,
    }));
  }
}
