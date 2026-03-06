import { HttpContext } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { groupBy } from "lodash-es";
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
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
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

  private subscriptionsService = inject(SubscriptionsRestService);

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
        this.groupBySubscription(entriesToImport),
        this.persistSubscriptionEntries.bind(this),
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

  private groupBySubscription(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): ReadonlyArray<ReadonlyArray<SubscriptionDetailImportEntry>> {
    return Object.values(
      groupBy(entries, (entry) => entry.data.subscriptionDetail?.Id ?? ""),
    );
  }

  private persistSubscriptionEntries(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Observable<ReadonlyArray<SubscriptionDetailImportEntry>> {
    const { changed, unchanged } = this.getChangedEntries(entries);

    // Ignore entries with an unchanged value
    unchanged.forEach((entry) => this.markSuccessEntry(entry));

    // Save new value of changed entries
    return of(changed).pipe(
      switchMap(this.updateSubscriptionDetails.bind(this)),
      map(() => {
        // Handle success
        changed.forEach((entry) => this.markSuccessEntry(entry));
        return entries;
      }),
      catchError((error) => {
        // Handle error
        changed.forEach((entry) => this.markErrorEntry(entry, error));
        return of(entries);
      }),
    );
  }

  private getChangedEntries(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): {
    changed: ReadonlyArray<SubscriptionDetailImportEntry>;
    unchanged: ReadonlyArray<SubscriptionDetailImportEntry>;
  } {
    return entries.reduce<{
      changed: Array<SubscriptionDetailImportEntry>;
      unchanged: Array<SubscriptionDetailImportEntry>;
    }>(
      (acc, entry) => {
        if (
          this.getNormalizedValue(entry) == entry.data.subscriptionDetail?.Value
        ) {
          acc.unchanged.push(entry);
        } else {
          acc.changed.push(entry);
        }
        return acc;
      },
      { changed: [], unchanged: [] },
    );
  }

  /**
   * Updates all subscription details of a single subscription.
   */
  private updateSubscriptionDetails(
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ): Observable<void> {
    // If you want to only simulate the write request when testing the upload,
    // you may uncomment the following (this also causes to randomly fail some
    // of the entries):

    // if (Math.random() > 0.75) {
    //   throw new Error("Random error");
    // }
    // return of(undefined).pipe(delay(500 + (Math.random() - 0.5) * 300));

    const entriesWithoutDetail = entries.filter(
      (entry) => !entry.data.subscriptionDetail,
    );
    if (entriesWithoutDetail.length > 0) {
      return throwError(
        () =>
          new Error(
            `Subscription detail not present for entries: ${JSON.stringify(
              entriesWithoutDetail.map(({ entry }) => entry),
            )}`,
          ),
      );
    }

    const subscriptionId = entries[0].data.subscriptionDetail?.Id;
    if (!subscriptionId) {
      return throwError(
        () =>
          new Error(
            `Subscription ID not present for entry: ${JSON.stringify(entries[0].entry)}`,
          ),
      );
    }

    const subscriptionDetails = entries.map((entry) => ({
      Id: entry.data.subscriptionDetail!.Id,
      IdPerson: entry.data.subscriptionDetail!.IdPerson,
      EventId: entry.data.subscriptionDetail!.EventId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Value: this.getNormalizedValue(entry) as any,
    }));

    return this.subscriptionsService.updateSubscriptionDetails(
      subscriptionId,
      subscriptionDetails,
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
