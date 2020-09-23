import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { MyAbsencesAbstractConfirmComponent } from './my-absences-abstract-confirm.component';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { MyAbsencesService } from '../../services/my-absences.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

@Component({
  selector: 'erz-my-absences-confirm',
  templateUrl: './my-absences-abstract-confirm.component.html',
  styleUrls: ['./my-absences-abstract-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => selectedIds[0]?.lessonIds || [])
  );
  protected confirmationStateId = this.settings.unconfirmedAbsencesRefreshTime;

  constructor(
    fb: FormBuilder,
    router: Router,
    toastr: ToastrService,
    translate: TranslateService,
    presenceTypesService: PresenceTypesService,
    updateService: LessonPresencesUpdateRestService,
    storageService: StorageService,
    @Inject(SETTINGS) settings: Settings,
    private myAbsencesService: MyAbsencesService,
    private selectionService: ConfirmAbsencesSelectionService
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
    this.myAbsencesService.reset();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    this.router.navigate(['/my-absences']);
  }
}
