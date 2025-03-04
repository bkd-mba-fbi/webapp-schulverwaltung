import { Injectable, signal } from "@angular/core";
import { Observable, delay, firstValueFrom, of, switchMap } from "rxjs";
import { executeWithMaxConcurrency } from "src/app/shared/utils/observable";
import { SubscriptionDetailImportError } from "../utils/subscription-details/error";
import { SubscriptionDetailImportEntry } from "./import-validate-subscription-details.service";

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
export class ImportUploadSubscriptionDetailsService {
  progress = signal({
    uploading: 0,
    success: 0,
    error: 0,
    total: 0,
  });

  constructor() {}

  upload(
    validatedEntries: ReadonlyArray<SubscriptionDetailImportEntry>,
    { retryFailedOnly = false }: { retryFailedOnly?: boolean } = {},
  ): Promise<ReadonlyArray<SubscriptionDetailImportEntry>> {
    let importEntries = validatedEntries.filter(
      (entry) => entry.validationStatus === "valid",
    );
    if (retryFailedOnly) {
      importEntries = importEntries.filter(
        (entry) => entry.importStatus === "error",
      );
    }
    return this.persistEntries(importEntries).then(() => validatedEntries);
  }

  private async persistEntries(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Promise<void> {
    this.prepare(entries);

    await firstValueFrom(
      executeWithMaxConcurrency(
        entries,
        this.persistEntry.bind(this),
        MAX_CONCURRENT_REQUESTS,
      ),
    );
  }

  private prepare(entries: ReadonlyArray<SubscriptionDetailImportEntry>): void {
    // Mark all entries as "importing"
    entries.forEach((entry) => {
      entry.importStatus = "importing";
      entry.importError = null;
    });

    // Reset the progress
    this.progress.set({
      uploading: entries.length,
      success: 0,
      error: 0,
      total: entries.length,
    });
  }

  private persistEntry(entry: SubscriptionDetailImportEntry): Observable<void> {
    // Don't upload entries with an unchanged value
    if (entry.entry.value === entry.data.subscriptionDetail?.Value) {
      this.markSuccessEntry(entry);
      return of();
    }

    // TODO:
    // - Perform PUT request
    // - Retry
    // - Handle success & update progress
    // - Handle error & update progress
    return of().pipe(switchMap(delay(1000))) as Observable<void>;
  }

  private markSuccessEntry(entry: SubscriptionDetailImportEntry): void {
    entry.importStatus = "success";

    this.progress.update(({ uploading, success, ...rest }) => ({
      uploading: uploading - 1,
      success: success + 1,
      ...rest,
    }));
  }

  private markErrorEntry(
    entry: SubscriptionDetailImportEntry,
    error: SubscriptionDetailImportError,
  ): void {
    entry.importStatus = "success";
    entry.importError = error;

    this.progress.update(({ uploading, error, ...rest }) => ({
      uploading: uploading - 1,
      error: error + 1,
      ...rest,
    }));
  }
}
