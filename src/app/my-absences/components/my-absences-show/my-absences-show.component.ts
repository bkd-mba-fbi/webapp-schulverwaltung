import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { MyAbsencesService } from '../../services/my-absences.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { not } from 'src/app/shared/utils/filter';
import { isEmptyArray } from 'src/app/shared/utils/array';
import { flatten, uniq } from 'lodash-es';
import { LessonAbsence } from '../../../shared/models/lesson-absence.model';

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

  private loadReportUrl(): Observable<Option<string>> {
    return combineLatest([
      this.absencesSelectionService.selectedWithoutPresenceType$,
      this.absencesSelectionService.selectedIds$,
    ]).pipe(
      switchMap(([selectedWithout, selectedIds]) =>
        selectedWithout.length === 0 && selectedIds.length > 0
          ? this.getReportRecordIds(
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

  private getReportRecordIds(
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
