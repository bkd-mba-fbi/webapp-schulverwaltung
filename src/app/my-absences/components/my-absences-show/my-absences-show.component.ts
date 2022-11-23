import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { MyAbsencesService } from '../../services/my-absences.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { not } from 'src/app/shared/utils/filter';
import { isEmptyArray } from 'src/app/shared/utils/array';
import { flatten, uniq } from 'lodash-es';
import { LessonAbsence } from '../../../shared/models/lesson-absence.model';
import { LessonIncident } from '../../../shared/models/lesson-incident.model';

@Component({
  selector: 'erz-my-absences-show',
  templateUrl: './my-absences-show.component.html',
  styleUrls: ['./my-absences-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesShowComponent implements OnInit, OnDestroy {
  openAbsencesReportUrl$ = this.loadOpenAbsencesReportUrl();
  allAbsencesReportUrl$ = this.loadAllAbsencesReportUrl();
  openAbsencesReportAvailable$ =
    this.reportsService.studentConfirmationAvailability$;
  allAbsencesReportUrlAvailable$ = this.allAbsencesReportUrl$.pipe(
    map((url) => (url ? url.length > 0 : false))
  );

  private destroy$ = new Subject<void>();

  constructor(
    private reportsService: ReportsService,
    public myAbsencesService: MyAbsencesService,
    public absencesSelectionService: ConfirmAbsencesSelectionService
  ) {}

  ngOnInit(): void {
    // When the absences have been loaded, set the record IDs to
    // initiate the loading of the report's availability state
    this.myAbsencesService.openLessonAbsences$
      .pipe(take(1), filter(not(isEmptyArray)))
      .subscribe((absences: ReadonlyArray<LessonAbsence>) =>
        this.reportsService.setStudentConfirmationAvailabilityRecordIds(
          absences.map((a) => `${a.LessonRef.Id}_${a.RegistrationId}`)
        )
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private loadOpenAbsencesReportUrl(): Observable<Option<string>> {
    return combineLatest([
      this.absencesSelectionService.selectedWithoutPresenceType$,
      this.absencesSelectionService.selectedIds$,
    ]).pipe(
      switchMap(([selectedWithout, selectedIds]) =>
        selectedWithout.length === 0 && selectedIds.length > 0
          ? this.getOpenAbsencesReportRecordIds(
              uniq(flatten(selectedIds.map((s) => s.lessonIds)))
            )
          : of(null)
      ),
      map((recordIds) =>
        recordIds
          ? this.reportsService.getStudentConfirmationUrl(recordIds)
          : null
      )
    );
  }

  loadAllAbsencesReportUrl(): Observable<Option<string>> {
    return combineLatest([
      this.myAbsencesService.openLessonAbsences$,
      this.myAbsencesService.checkableLessonAbsences$,
      this.myAbsencesService.excusedLessonAbsences$,
      this.myAbsencesService.unexcusedLessonAbsences$,
      this.myAbsencesService.incidentsLessonAbsences$,
    ]).pipe(
      map(
        (
          absences: ReadonlyArray<ReadonlyArray<LessonAbsence | LessonIncident>>
        ) => this.buildUrl(flatten(absences))
      ),
      shareReplay(1)
    );
  }

  private buildUrl(absences: any[]) {
    return absences.length > 0
      ? this.reportsService.getEvaluateAbsencesUrl(
          this.getAllReportRecordIds(absences)
        )
      : null;
  }

  private getAllReportRecordIds(
    presences: ReadonlyArray<LessonAbsence | LessonIncident>
  ): ReadonlyArray<string> {
    return presences.map((p) => `${p.LessonRef.Id}_${p.RegistrationId}`);
  }

  private getOpenAbsencesReportRecordIds(
    lessonIds: ReadonlyArray<number>
  ): Observable<ReadonlyArray<string>> {
    return this.myAbsencesService.openLessonAbsences$.pipe(
      map((absences) =>
        absences
          .filter((a) => lessonIds.includes(a.LessonRef.Id))
          .map((a) => `${a.LessonRef.Id}_${a.RegistrationId}`)
      )
    );
  }
}
