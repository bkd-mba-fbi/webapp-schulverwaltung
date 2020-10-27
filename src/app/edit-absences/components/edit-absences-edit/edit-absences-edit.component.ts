import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  filter,
  finalize,
  map,
  shareReplay,
  startWith,
  take,
  takeUntil,
} from 'rxjs/operators';
import { SETTINGS, Settings } from 'src/app/settings';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { getValidationErrors } from 'src/app/shared/utils/form';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';
import { parseQueryString } from 'src/app/shared/utils/url';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';

enum Category {
  Absent = 'absent',
  Dispensation = 'dispensation',
  HalfDay = 'half-day',
  Incident = 'incident',
  Present = 'present',
}

@Component({
  selector: 'erz-edit-absences-edit',
  templateUrl: './edit-absences-edit.component.html',
  styleUrls: ['./edit-absences-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesEditComponent implements OnInit, OnDestroy {
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

  incidentIdErrors$ = combineLatest([
    getValidationErrors(this.formGroup.get('incidentId')),
    this.submitted$,
  ]).pipe(
    filter((v) => v[1]),
    map((v) => v[0]),
    startWith([])
  );

  availableCategories = [
    Category.Absent,
    Category.Dispensation,
    Category.HalfDay,
    Category.Incident,
    Category.Present,
  ];

  confirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(map(this.sortAbsenceConfirmationStates.bind(this)), shareReplay(1));

  absenceTypes$ = this.presenceTypesService.confirmationTypes$;

  incidents$ = this.presenceTypesService.incidentTypes$;

  // Remove Category HalfDay if the corresponding PresenceType is inactive
  activeCategories$ = this.presenceTypesService.halfDayActive$.pipe(
    map((halfDayActive) =>
      halfDayActive
        ? this.availableCategories
        : this.availableCategories.filter((c) => c !== Category.HalfDay)
    )
  );

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private state: EditAbsencesStateService,
    private dropDownItemsService: DropDownItemsRestService,
    private presenceTypesService: PresenceTypesService,
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
      // Disable confirmation value radios and absence type/incident
      // select when not absent
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

  isIncident(category: Category): boolean {
    return category === Category.Incident;
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      const {
        category,
        confirmationValue,
        absenceTypeId,
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
        Validators.required,
      ],
      absenceTypeId: [null, Validators.required],
      incidentId: [{ value: null, disabled: true }, Validators.required],
    });
  }

  private updateConfirmationValueDisabled(): void {
    const categoryControl = this.formGroup.get('category');
    const confirmationValueControl = this.formGroup.get('confirmationValue');
    const absenceTypeIdControl = this.formGroup.get('absenceTypeId');
    const incidentIdControl = this.formGroup.get('incidentId');
    if (
      categoryControl &&
      confirmationValueControl &&
      absenceTypeIdControl &&
      incidentIdControl
    ) {
      if (categoryControl.value === Category.Absent) {
        confirmationValueControl.enable();
        this.updateAbsenceTypeIdDisabled();
      } else {
        confirmationValueControl.disable();
        absenceTypeIdControl.disable();
      }

      if (categoryControl.value === Category.Incident) {
        incidentIdControl.enable();
      } else {
        incidentIdControl.disable();
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
    // tslint:disable:prefer-const
    let {
      category,
      confirmationValue,
      absenceTypeId,
      incidentId,
    } = this.formGroup.value;
    // tslint:enable:prefer-const
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
      case Category.Incident:
        absenceTypeId = incidentId;
        confirmationValue = null;
        break;
    }
    return {
      category,
      confirmationValue,
      absenceTypeId,
    };
  }

  private save(
    category: Category,
    confirmationValue: Option<number>,
    absenceTypeId: number
  ): void {
    let requests: ReadonlyArray<Observable<void>> = [];
    this.saving$.next(true);

    if (category === Category.Present) {
      requests = this.createResetBulkRequests();
    } else {
      requests = this.createEditBulkRequests(confirmationValue, absenceTypeId);
    }
    combineLatest(requests) // tslint:disable-line
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private createResetBulkRequests(): ReadonlyArray<Observable<void>> {
    return this.state.selected.map(({ lessonIds, personIds }) =>
      this.updateService.removeLessonPresences(lessonIds, personIds)
    );
  }

  private createEditBulkRequests(
    confirmationValue: Option<number>,
    absenceTypeId: number
  ): ReadonlyArray<Observable<void>> {
    return this.state.selected.map(({ lessonIds, personIds }) =>
      this.updateService.editLessonPresences(
        lessonIds,
        personIds,
        absenceTypeId,
        confirmationValue || undefined
      )
    );
  }

  private onSaveSuccess(): void {
    this.state.resetSelection();
    this.toastr.success(
      this.translate.instant('edit-absences.edit.save-success')
    );
    this.navigateBack(true);
  }

  private navigateBack(reload?: true): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.router.navigate(['/edit-absences'], {
        queryParams: {
          ...parseQueryString(params.returnparams),
          reload, // Make sure the entries get reloaded when returning to the list
        },
      });
    });
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
}
