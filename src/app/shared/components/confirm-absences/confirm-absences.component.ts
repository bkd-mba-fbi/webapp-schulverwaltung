import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  Optional,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import {
  takeUntil,
  filter,
  map,
  finalize,
  shareReplay,
  take,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { notNull } from 'src/app/shared/utils/filter';
import { getValidationErrors } from 'src/app/shared/utils/form';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { findDropDownItem$ } from 'src/app/shared/utils/drop-down-items';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { ConfirmAbsencesSelectionService } from '../../services/confirm-absences-selection.service';
import {
  CONFIRM_ABSENCES_SERVICE,
  IConfirmAbsencesService,
} from '../../tokens/confirm-absences-service';

@Component({
  selector: 'erz-confirm-absences',
  templateUrl: './confirm-absences.component.html',
  styleUrls: ['./confirm-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAbsencesComponent implements OnInit, OnDestroy {
  formGroup = this.createFormGroup();

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  formErrors$ = combineLatest([
    getValidationErrors(this.formGroup),
    this.submitted$,
  ]).pipe(
    filter((v) => v[1]),
    map((v) => v[0]),
    startWith([])
  );

  absenceTypeIdErrors$ = combineLatest([
    getValidationErrors(this.formGroup.get('absenceTypeId')),
    this.submitted$,
  ]).pipe(
    filter((v) => v[1]),
    map((v) => v[0]),
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

  absenceTypes$ = this.presenceTypesService.confirmationTypes$;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private selectionService: ConfirmAbsencesSelectionService,
    private dropDownItemsService: DropDownItemsRestService,
    private presenceTypesService: PresenceTypesService,
    private updateService: LessonPresencesUpdateRestService,
    @Inject(SETTINGS) private settings: Settings,
    @Optional()
    @Inject(CONFIRM_ABSENCES_SERVICE)
    private openAbsencesEditService?: IConfirmAbsencesService
  ) {}

  ngOnInit(): void {
    this.selectionService.selectedIds$
      .pipe(take(1))
      .subscribe((selectedIds) => {
        if (selectedIds.length === 0) {
          // Nothing to confirm if no entries are selected
          this.navigateBack();
        }
      });

    const confirmationValueControl = this.formGroup.get('confirmationValue');
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (confirmationValueControl && absenceTypeIdControl) {
      // Disable confirmation value select when unexcused
      confirmationValueControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateAbsenceTypeIdDisabled.bind(this));

      // Disable form when saving
      this.saving$.pipe(takeUntil(this.destroy$)).subscribe((saving) => {
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
        .pipe(take(1), filter(notNull))
        .subscribe((excusedState) =>
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
        .pipe(take(1), filter(notNull))
        .subscribe((confirmedState) => {
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
      absenceTypeId: [null, Validators.required],
    });
  }

  private updateAbsenceTypeIdDisabled(confirmationValue: number): void {
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (absenceTypeIdControl) {
      this.excusedState$
        .pipe(take(1), filter(notNull))
        .subscribe((excusedState) =>
          confirmationValue === excusedState.Key
            ? absenceTypeIdControl.enable()
            : absenceTypeIdControl.disable()
        );
    }
  }

  private save(confirmationValue: number, absenceTypeId: number): void {
    this.saving$.next(true);

    this.selectionService.selectedIds$
      .pipe(
        take(1),
        switchMap((selectedIds) =>
          combineLatest(
            selectedIds.map(({ lessonIds, personIds }) =>
              this.updateService.confirmLessonPresences(
                lessonIds,
                personIds,
                absenceTypeId,
                confirmationValue
              )
            )
          )
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    if (this.openAbsencesEditService?.updateAfterConfirm) {
      this.openAbsencesEditService.updateAfterConfirm();
    }
    this.toastr.success(
      this.translate.instant('open-absences.edit.save-success')
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(
      this.openAbsencesEditService?.confirmBackLink || ['..'],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.openAbsencesEditService?.confirmBackLinkParams,
      }
    );
  }
}
