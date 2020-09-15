import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs/operators';

import { MyAbsencesAbstractConfirmComponent } from './my-absences-abstract-confirm.component';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MyAbsencesReportStateService } from '../../services/my-absences-report-state.service';
import { MyAbsencesReportSelectionService } from '../../services/my-absences-report-selection.service';

@Component({
  selector: 'erz-my-absences-confirm',
  templateUrl: './my-absences-abstract-confirm.component.html',
  styleUrls: ['./my-absences-abstract-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesReportConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  // All absence types including half days
  absenceTypes$ = this.presenceTypesService.confirmationTypes$.pipe(
    map((types) =>
      types.filter(
        (t) => t.IsAbsence || t.Id === this.settings.halfDayPresenceTypeId
      )
    )
  );

  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => selectedIds[0]?.lessonIds || [])
  );
  protected confirmationStateId = this.settings.checkableAbsenceStateId;

  constructor(
    fb: FormBuilder,
    router: Router,
    toastr: ToastrService,
    translate: TranslateService,
    presenceTypesService: PresenceTypesService,
    updateService: LessonPresencesUpdateRestService,
    storageService: StorageService,
    @Inject(SETTINGS) settings: Settings,
    private state: MyAbsencesReportStateService,
    private selectionService: MyAbsencesReportSelectionService
  ) {
    super(
      fb,
      router,
      toastr,
      translate,
      presenceTypesService,
      updateService,
      storageService,
      settings
    );
  }

  protected onSaveSuccess(): void {
    this.selectionService.clear();
    this.state.resetEntries();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    this.state.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      this.router.navigate(['/my-absences/report'], {
        queryParams,
      });
    });
  }
}
