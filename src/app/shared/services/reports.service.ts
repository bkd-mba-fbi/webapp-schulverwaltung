import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  ReplaySubject,
  ConnectableObservable,
  Subscription,
} from 'rxjs';
import {
  shareReplay,
  map,
  switchMap,
  startWith,
  multicast,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators';

import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from './storage.service';
import { notNull } from '../utils/filter';

/**
 * Reports are PDFs that are served under a special URL. They can be
 * generated for a given set of records (the type of the records is
 * depending on the report). In the UI, we simply create a link to the
 * report URL, since the access token can be provided as query param.
 *
 * Every report has an availability state (whether it's active for the
 * current tenant/user or not), that can be requested via an API
 * endpoint. The availability request must contain at least one record
 * ID. Since we only link to reports containing records that are
 * already loaded (hence the user must have access to them), we can
 * request the availability state once, which whatever record ID.
 *
 * The report URL looks like this (where the report can be downloaded):
 *   /Files/CrystalReports/{report context}/{report id}
 *     ?ids={comma separated record ids to be included in the report}
 *     &token={access token}
 *
 * And the availability of the report can be requested via this enpoint:
 *   /CrystalReports/AvailableReports/{report context}
 *     ?ids=${report id}
 *     &keys={comma separated record ids (same as ?ids in the report url)}
 */
@Injectable({
  providedIn: 'root',
})
export class ReportsService implements OnDestroy {
  studentConfirmationAvailabilityRecordId$ = new Subject<string>();

  personMasterDataAvailability$ = this.loadReportAvailability(
    'Person',
    this.settings.personMasterDataReportId,
    [Number(this.storageService.getPayload()?.id_person)]
  ).pipe(shareReplay(1));

  studentConfirmationAvailability$ = this.loadReportAvailabilityByAsyncRecordId(
    'Praesenzinformation',
    this.settings.studentConfirmationReportId,
    this.studentConfirmationAvailabilityRecordId$
  );

  private studentConfirmationAvailabilitySub: Subscription;

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService,
    private http: HttpClient
  ) {
    this.studentConfirmationAvailabilitySub = (this
      .studentConfirmationAvailability$ as ConnectableObservable<boolean>).connect();
  }

  ngOnDestroy(): void {
    this.studentConfirmationAvailabilitySub.unsubscribe();
  }

  /**
   * Report: Stammblatt
   */
  getPersonMasterDataUrl(personId: number): string {
    return this.getReportUrl('Person', this.settings.personMasterDataReportId, [
      personId,
    ]);
  }

  /**
   * Report: Lektionsbuchungen
   *
   * The record IDs are the string
   * {LessonAbsences.LessonRef.Id}_{LessonAbsences.RegistrationId}
   */
  getStudentConfirmationUrl(recordIds: ReadonlyArray<string>): string {
    return this.getReportUrl(
      'Praesenzinformation',
      this.settings.studentConfirmationReportId,
      recordIds
    );
  }

  setStudentConfirmationAvailabilityRecordId(recordId: string): void {
    this.studentConfirmationAvailabilityRecordId$.next(recordId);
  }

  private getReportUrl(
    context: string,
    reportId: number,
    recordIds: ReadonlyArray<number | string>
  ): string {
    return `${
      this.settings.apiUrl
    }/Files/CrystalReports/${context}/${reportId}?ids=${recordIds.join(
      ','
    )}&token=${this.storageService.getAccessToken()}`;
  }

  private loadReportAvailability(
    context: string,
    reportId: number,
    recordIds: ReadonlyArray<number | string>
  ): Observable<boolean> {
    return this.http
      .get<unknown>(
        `${
          this.settings.apiUrl
        }/CrystalReports/AvailableReports/${context}?ids=${reportId}&keys=${recordIds.join(
          ','
        )}`
      )
      .pipe(map(notNull), startWith(false), distinctUntilChanged());
  }

  private loadReportAvailabilityByAsyncRecordId(
    context: string,
    reportId: number,
    recordId$: Observable<number | string>
  ): Observable<boolean> {
    return recordId$.pipe(
      filter((_, i) => i === 0), // Fetch the availability only once and cache it afterwards (but don't complete)
      switchMap((recordId) =>
        this.loadReportAvailability(context, reportId, [recordId])
      ),
      multicast(() => new ReplaySubject<boolean>(1))
    );
  }
}
