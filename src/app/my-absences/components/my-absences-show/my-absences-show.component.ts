import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Observable, combineLatest, Subject, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { MyAbsencesService } from '../../services/my-absences.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'erz-my-absences-show',
  templateUrl: './my-absences-show.component.html',
  styleUrls: ['./my-absences-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesShowComponent implements OnInit, OnDestroy {
  reportUrl$ = this.loadReportUrl();
  reportAvailable$ = this.reportsService.studentConfirmationAvailability$;

  private destroy$ = new Subject();

  constructor(
    private reportsService: ReportsService,
    public myAbsencesService: MyAbsencesService,
    public absencesSelectionService: ConfirmAbsencesSelectionService
  ) {}

  ngOnInit(): void {
    // When the absences have been loaded, set the record ID to
    // initiate the loading of the report's availability state
    this.myAbsencesService.lessonAbsences$
      .pipe(take(1))
      .subscribe((absences) => {
        if (absences.length > 0) {
          const absence = absences[0];
          this.reportsService.setStudentConfirmationAvailabilityRecordId(
            `${absence.LessonRef.Id}_${absence.RegistrationId}`
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private loadReportUrl(): Observable<Option<string>> {
    return combineLatest([
      this.absencesSelectionService.selectedWithoutPresenceType$,
      this.absencesSelectionService.selectedIds$,
    ]).pipe(
      switchMap(([selectedWithout, selectedIds]) =>
        selectedWithout.length === 0 && selectedIds.length > 0
          ? this.getReportRecordIds(selectedIds[0].lessonIds)
          : of(null)
      ),
      map((recordIds) =>
        recordIds
          ? this.reportsService.getStudentConfirmationUrl(recordIds)
          : null
      )
    );
  }

  private getReportRecordIds(
    lessonIds: ReadonlyArray<number>
  ): Observable<ReadonlyArray<string>> {
    return this.myAbsencesService.lessonAbsences$.pipe(
      map((absences) =>
        absences
          .filter((a) => lessonIds.includes(a.LessonRef.Id))
          .map((a) => `${a.LessonRef.Id}_${a.RegistrationId}`)
      )
    );
  }
}
