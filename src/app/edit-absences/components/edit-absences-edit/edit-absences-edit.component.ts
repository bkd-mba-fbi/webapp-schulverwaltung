import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest, Observable } from 'rxjs';
import {
  takeUntil,
  filter,
  map,
  finalize,
  shareReplay,
  startWith
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { flattenDeep } from 'lodash-es';

import { getValidationErrors } from 'src/app/shared/utils/form';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { sortPresenceTypes } from 'src/app/shared/utils/presence-types';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';

enum Category {
  Absent = 'absent',
  Dispensation = 'dispensation',
  HalfDay = 'half-day',
  Late = 'late',
  Present = 'present'
}

@Component({
  selector: 'erz-edit-absences-edit',
  templateUrl: './edit-absences-edit.component.html',
  styleUrls: ['./edit-absences-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAbsencesEditComponent implements OnInit, OnDestroy {
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

  categories = Object.values(Category);

  confirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(
      map(this.sortAbsenceConfirmationStates.bind(this)),
      shareReplay(1)
    );

  absenceTypes$ = this.state.presenceTypes$.pipe(
    map(this.filterAbsenceTypes.bind(this)),
    map(sortPresenceTypes),
    shareReplay(1)
  );

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private state: EditAbsencesStateService,
    private dropDownItemsService: DropDownItemsRestService,
    private updateService: LessonPresencesUpdateRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  ngOnInit(): void {
    if (this.state.selected.length === 0) {
      // Nothing to confirm if no entries are selected
      this.navigateBack();
    }

    const categoryControl = this.formGroup.get('category');
    const confirmationValueControl = this.formGroup.get('confirmationValue');
    if (categoryControl && confirmationValueControl) {
      // Disable confirmation value radios and absence type select
      // when not absent
      categoryControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateConfirmationValueDisabled.bind(this));

      // Disable absence type select when not excused
      confirmationValueControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateAbsenceTypeIdDisabled.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  isAbsent(category: Category): boolean {
    return category === Category.Absent;
  }

  isExcused(state: DropDownItem): boolean {
    return state.Key === this.settings.excusedAbsenceStateId;
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      const {
        category,
        confirmationValue,
        absenceTypeId
      } = this.fetchAndProcessFormValues();
      this.save(category, confirmationValue, absenceTypeId);
    }
  }

  cancel(): void {
    this.navigateBack();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      category: [Category.Absent, Validators.required],
      confirmationValue: [
        this.settings.excusedAbsenceStateId,
        Validators.required
      ],
      absenceTypeId: [null, Validators.required]
    });
  }

  private updateConfirmationValueDisabled(): void {
    const categoryControl = this.formGroup.get('category');
    const confirmationValueControl = this.formGroup.get('confirmationValue');
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (categoryControl && confirmationValueControl && absenceTypeIdControl) {
      if (categoryControl.value === Category.Absent) {
        confirmationValueControl.enable();
        this.updateAbsenceTypeIdDisabled();
      } else {
        confirmationValueControl.disable();
        absenceTypeIdControl.disable();
      }
    }
  }

  private updateAbsenceTypeIdDisabled(): void {
    const confirmationValueControl = this.formGroup.get('confirmationValue');
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    if (confirmationValueControl && absenceTypeIdControl) {
      confirmationValueControl.value === this.settings.excusedAbsenceStateId
        ? absenceTypeIdControl.enable()
        : absenceTypeIdControl.disable();
    }
  }

  private fetchAndProcessFormValues(): {
    category: Category;
    confirmationValue: Option<number>;
    absenceTypeId: number;
  } {
    // tslint:disable-next-line:prefer-const
    let { category, confirmationValue, absenceTypeId } = this.formGroup.value;
    switch (category) {
      case Category.Absent:
        if (confirmationValue !== this.settings.excusedAbsenceStateId) {
          absenceTypeId = this.settings.absencePresenceTypeId;
        }
        break;
      case Category.Dispensation:
        absenceTypeId = this.settings.dispensationPresenceTypeId;
        confirmationValue = null;
        break;
      case Category.HalfDay:
        absenceTypeId = this.settings.halfDayPresenceTypeId;
        confirmationValue = null;
        break;
      case Category.Late:
        absenceTypeId = this.settings.latePresenceTypeId;
        confirmationValue = null;
        break;
    }
    return {
      category,
      confirmationValue,
      absenceTypeId
    };
  }

  private save(
    category: Category,
    confirmationValue: Option<number>,
    absenceTypeId: number
  ): void {
    let requests: ReadonlyArray<Observable<void>> = [];
    this.saving$.next(true);

    // TODO: Remove workaround. Due to a backend bug, a request for
    // each lessonId/personId pair has to be done (see #92, #100). Use
    // the create*BulkRequests functions and remove the
    // create*BulkRequestsWorkaround functions, if this issue is fixed
    // in the backend.
    if (category === Category.Present) {
      // requests = this.createResetBulkRequests();
      requests = this.createResetBulkRequestsWorkaround();
    } else {
      // requests = this.createEditBulkRequests(confirmationValue, absenceTypeId);
      requests = this.createEditBulkRequestsWorkaround(
        confirmationValue,
        absenceTypeId
      );
    }
    combineLatest(requests)
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  /**
   * TODO: Use me when backend is fixed (see #100)
   */
  private createResetBulkRequests(): ReadonlyArray<Observable<void>> {
    return this.state.selected.map(({ lessonIds, personIds }) =>
      this.updateService.removeLessonPresences(lessonIds, personIds)
    );
  }

  /**
   * TODO: Remove me when backend is fixed (see #100)
   */
  private createResetBulkRequestsWorkaround(): ReadonlyArray<Observable<void>> {
    const selected = (flattenDeep(
      this.state.selected.map(({ lessonIds, personIds }) =>
        lessonIds.map(lessonId =>
          personIds.map(personId => ({ lessonId, personId }))
        )
      )
    ) as unknown) as { lessonId: number; personId: number }[];
    return selected.map(({ lessonId, personId }) =>
      this.updateService.removeLessonPresences([lessonId], [personId])
    );
  }

  /**
   * TODO: Use me when backend is fixed (see #100)
   */
  private createEditBulkRequests(
    confirmationValue: Option<number>,
    absenceTypeId: number
  ): ReadonlyArray<Observable<void>> {
    return this.state.selected.map(({ lessonIds, personIds }) =>
      this.updateService.editLessonPresences(
        lessonIds,
        personIds,
        absenceTypeId,
        // TODO: Workaround since backend can't handle null values, see #110
        confirmationValue || undefined
      )
    );
  }

  /**
   * TODO: Remove me when backend is fixed (see #100)
   */
  private createEditBulkRequestsWorkaround(
    confirmationValue: Option<number>,
    absenceTypeId: number
  ): ReadonlyArray<Observable<void>> {
    const selected = (flattenDeep(
      this.state.selected.map(({ lessonIds, personIds }) =>
        lessonIds.map(lessonId =>
          personIds.map(personId => ({ lessonId, personId }))
        )
      )
    ) as unknown) as { lessonId: number; personId: number }[];
    return selected.map(({ lessonId, personId }) =>
      this.updateService.editLessonPresences(
        [lessonId],
        [personId],
        absenceTypeId,
        // TODO: Workaround since backend can't handle null values, see #110
        confirmationValue || undefined
      )
    );
  }

  private onSaveSuccess(): void {
    this.state.resetSelection();
    this.toastr.success(
      this.translate.instant('edit-absences.edit.save-success')
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/edit-absences']);
  }

  private sortAbsenceConfirmationStates(
    states: ReadonlyArray<DropDownItem>
  ): ReadonlyArray<DropDownItem> {
    return states.slice().sort((a, b) => {
      if (a.Key === this.settings.excusedAbsenceStateId) {
        return -1;
      }
      if (b.Key === this.settings.excusedAbsenceStateId) {
        return 1;
      }
      return a.Value.localeCompare(b.Value);
    });
  }

  private filterAbsenceTypes(
    types: ReadonlyArray<PresenceType>
  ): ReadonlyArray<PresenceType> {
    return types.filter(t => t.NeedsConfirmation && t.IsAbsence);
  }
}
