import { HttpContext } from "@angular/common/http";
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
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { executeWithMaxConcurrency } from "src/app/shared/utils/observable";
import { ImportError } from "../common/import-state.service";
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
  progress = signal<UploadProgress>({
    uploading: 0,
    success: 0,
    error: 0,
    total: 0,
  });

  private subscriptionDetailsService = inject(SubscriptionDetailsRestService);

  async upload(
    validatedEntries: ReadonlyArray<SubscriptionDetailImportEntry>,
    { retryFailedOnly = false }: { retryFailedOnly?: boolean } = {},
  ): Promise<ReadonlyArray<SubscriptionDetailImportEntry>> {
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
    entriesToImport: ReadonlyArray<SubscriptionDetailImportEntry>,
    allEntries: ReadonlyArray<SubscriptionDetailImportEntry>,
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
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
    allEntries: ReadonlyArray<SubscriptionDetailImportEntry>,
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

  private persistEntry(
    entry: SubscriptionDetailImportEntry,
  ): Observable<SubscriptionDetailImportEntry> {
    if (
      this.getNormalizedValue(entry) == entry.data.subscriptionDetail?.Value
    ) {
      // Ignore entry with an unchanged value
      this.markSuccessEntry(entry);
      return of(entry);
    }

    // Save new value
    return of(entry).pipe(
      switchMap(this.updateSubscriptionDetail.bind(this)),
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

  private updateSubscriptionDetail(
    entry: SubscriptionDetailImportEntry,
  ): Observable<void> {
    if (!entry.data.subscriptionDetail)
      return throwError(
        () =>
          new Error(
            `Subscription not present for entry: ${JSON.stringify(entry.entry)}`,
          ),
      );

    // If you want to only simulate the write request when testing the upload,
    // you may uncomment the following (this also causes to randomly fail some
    // of the entries):

    // if (Math.random() > 0.75) {
    //   throw new Error("Random error");
    // }
    // return of(undefined).pipe(delay(500 + (Math.random() - 0.5) * 300));

    return this.subscriptionDetailsService.update(
      entry.data.subscriptionDetail,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.getNormalizedValue(entry) as any,
      new HttpContext().set(RestErrorInterceptorOptions, {
        disableErrorHandling: true,
      }),
    );
  }

  private getNormalizedValue({
    entry,
    data: { subscriptionDetail },
  }: SubscriptionDetailImportEntry): unknown {
    if (Array.isArray(subscriptionDetail?.DropdownItems)) {
      const item = subscriptionDetail.DropdownItems.find(
        (item) => item.Value === entry.value,
      );
      if (item) {
        return item.Key;
      }
    }
    return entry.value;
  }

  private markSuccessEntry(entry: SubscriptionDetailImportEntry): void {
    entry.importStatus = "success";
    entry.importError = null;

    this.progress.update(({ uploading, success, ...rest }) => ({
      uploading: uploading - 1,
      success: success + 1,
      ...rest,
    }));
  }

  private markErrorEntry(
    entry: SubscriptionDetailImportEntry,
    error: unknown,
  ): void {
    entry.importStatus = "error";
    entry.importError = new ImportError(error);

    this.progress.update(({ uploading, error, ...rest }) => ({
      uploading: uploading - 1,
      error: error + 1,
      ...rest,
    }));
  }
}
