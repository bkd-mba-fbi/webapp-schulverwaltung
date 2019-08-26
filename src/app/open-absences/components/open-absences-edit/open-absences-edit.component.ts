import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import {
  takeUntil,
  filter,
  map,
  finalize,
  shareReplay,
  take,
  startWith
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { flattenDeep } from 'lodash-es';

import { notNull } from 'src/app/shared/utils/filter';
import { getValidationErrors } from 'src/app/shared/utils/form';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { findDropDownItem$ } from 'src/app/shared/utils/drop-down-items';
import { PresenceTypesRestService } from 'src/app/shared/services/presence-types-rest.service';
import { sortPresenceTypes } from 'src/app/shared/utils/presence-types';

@Component({
  selector: 'erz-open-absences-edit',
  templateUrl: './open-absences-edit.component.html',
  styleUrls: ['./open-absences-edit.component.scss']
})
export class OpenAbsencesEditComponent implements OnInit, OnDestroy {
  formGroup = this.createFormGroup();

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  formErrors$ = combineLatest(
    getValidationErrors(this.formGroup),
    this.submitted$
  ).pipe(
    filter(v => v[1]),
    map(v => v[0]),
    startWith([])
  );

  absenceTypeIdErrors$ = combineLatest(
    getValidationErrors(this.formGroup.get('absenceTypeId')),
    this.submitted$
  ).pipe(
    filter(v => v[1]),
    map(v => v[0]),
    startWith([])
  );

  private confirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(shareReplay(1));

  excusedState$ = findDropDownItem$(
    this.confirmationStates$,
    this.settings.excusedAbsenceStateId
  );
  unexcusedState$ = findDropDownItem$(
    this.confirmationStates$,
    this.settings.unexcusedAbsenceStateId
  );

  absenceTypes$ = this.presenceTypesService.getConfirmationTypes().pipe(
    map(sortPresenceTypes),
    shareReplay(1)
  );

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private openAbsencesService: OpenAbsencesService,
    private dropDownItemsService: DropDownItemsRestService,
    private presenceTypesService: PresenceTypesRestService,
    private updateService: LessonPresencesUpdateRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  ngOnInit(): void {
    if (this.openAbsencesService.selected.length === 0) {
      // Nothing to confirm if no entries are selected
      this.navigateBack();
    }

    const confirmationValueControl = this.formGroup.get('confirmationValue');
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (confirmationValueControl && absenceTypeIdControl) {
      // Disable confirmation value select when unexcused
      confirmationValueControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateAbsenceTypeIdDisabled.bind(this));

      // Disable form when saving
      this.saving$.pipe(takeUntil(this.destroy$)).subscribe(saving => {
        if (saving) {
          confirmationValueControl.disable();
          absenceTypeIdControl.disable();
        } else {
          confirmationValueControl.enable();
          this.updateAbsenceTypeIdDisabled(confirmationValueControl.value);
        }
      });

      // Initially select excused state radio button
      this.excusedState$
        .pipe(
          take(1),
          filter(notNull)
        )
        .subscribe(excusedState =>
          confirmationValueControl.setValue(excusedState.Key)
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      this.excusedState$
        .pipe(
          take(1),
          filter(notNull)
        )
        .subscribe(confirmedState => {
          const { confirmationValue, absenceTypeId } = this.formGroup.value;
          this.save(
            confirmationValue,
            confirmationValue === confirmedState.Key
              ? absenceTypeId
              : this.settings.absencePresenceTypeId
          );
        });
    }
  }

  cancel(): void {
    this.navigateBack();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      confirmationValue: [null],
      absenceTypeId: [null, Validators.required]
    });
  }

  private updateAbsenceTypeIdDisabled(confirmationValue: number): void {
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (absenceTypeIdControl) {
      this.excusedState$
        .pipe(
          take(1),
          filter(notNull)
        )
        .subscribe(excusedState =>
          confirmationValue === excusedState.Key
            ? absenceTypeIdControl.enable()
            : absenceTypeIdControl.disable()
        );
    }
  }

  private save(confirmationValue: number, absenceTypeId: number): void {
    this.saving$.next(true);
    // Execute bulk requests
    // const requests = this.openAbsencesService.selected.map(
    //   ({ lessonIds, personIds }) =>
    //     this.updateService.confirmLessonPresences(
    //       lessonIds,
    //       personIds,
    //       absenceTypeId,
    //       confirmationValue
    //     )
    // );

    // Workaround: due to a backend bug, a request for each
    // lessonId/personId pair has to be done (see #92). Use the above
    // implementation that performs bulk requests for multiple
    // lessonIds if this issue is fixed in the backend.
    const selected = (flattenDeep(
      this.openAbsencesService.selected.map(({ lessonIds, personIds }) =>
        lessonIds.map(lessonId =>
          personIds.map(personId => ({ lessonId, personId }))
        )
      )
    ) as unknown) as { lessonId: number; personId: number }[];
    const requests = selected.map(({ lessonId, personId }) =>
      this.updateService.confirmLessonPresences(
        [lessonId],
        [personId],
        absenceTypeId,
        confirmationValue
      )
    );

    combineLatest(requests)
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.openAbsencesService.removeSelectedEntries();
    this.toastr.success(
      this.translate.instant('open-absences.edit.save-success')
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    if (this.openAbsencesService.currentDetail) {
      this.router.navigate([
        '/open-absences/detail',
        this.openAbsencesService.currentDetail.personId,
        this.openAbsencesService.currentDetail.date
      ]);
    } else {
      this.router.navigate(['/open-absences']);
    }
  }
}
