import { OnInit, Component, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subject, of } from 'rxjs';
import { finalize, map, filter, switchMap, take } from 'rxjs/operators';

import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { getValidationErrors } from 'src/app/shared/utils/form';
import { Settings } from 'src/app/settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { isEmptyArray } from 'src/app/shared/utils/array';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  template: '',
})
export abstract class MyAbsencesAbstractConfirmComponent
  implements OnInit, OnDestroy
{
  formGroup = this.createFormGroup();

  saving$ = new BehaviorSubject(false);
  protected submitted$ = new BehaviorSubject(false);

  absenceTypes$ = combineLatest([
    this.getConfirmationTypes(),
    this.getHalfDayType(),
  ]).pipe(
    map(([confirmationTypes, halfDayType]) =>
      halfDayType ? [...confirmationTypes, halfDayType] : confirmationTypes,
    ),
  );

  absenceTypeIdErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    'absenceTypeId',
  );

  abstract selectedLessonIds$: Observable<ReadonlyArray<number>>;
  protected abstract confirmationStateId: Option<number>;

  protected destroy$ = new Subject<void>();

  constructor(
    protected fb: UntypedFormBuilder,
    protected router: Router,
    protected toastService: ToastService,
    protected translate: TranslateService,
    protected presenceTypesService: PresenceTypesService,
    protected updateService: LessonPresencesUpdateRestService,
    protected storageService: StorageService,
    protected settings: Settings,
  ) {}

  ngOnInit(): void {
    // Nothing to confirm if no entries are selected
    this.selectedLessonIds$
      .pipe(take(1), filter(isEmptyArray))
      .subscribe(() => this.navigateBack());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      const { absenceTypeId } = this.formGroup.value;
      this.save(absenceTypeId);
    }
  }

  cancel(): void {
    this.navigateBack();
  }

  getSelectedCount(): Observable<number> {
    return this.selectedLessonIds$.pipe(map((ids) => ids.length));
  }

  protected getConfirmationTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.presenceTypesService.confirmationTypes$.pipe(
      map((types) =>
        types.filter(
          (t) => t.IsAbsence && t.Id !== this.settings.halfDayPresenceTypeId,
        ),
      ),
    );
  }

  protected getHalfDayType(): Observable<Option<PresenceType>> {
    return of(null);
  }

  protected createFormGroup(): UntypedFormGroup {
    return this.fb.group({
      absenceTypeId: [null, Validators.required],
    });
  }

  protected save(absenceTypeId: number): void {
    this.saving$.next(true);

    this.selectedLessonIds$
      .pipe(
        take(1),
        switchMap((selectedLessonIds) =>
          this.updateService.editLessonPresences(
            selectedLessonIds,
            [Number(this.storageService.getPayload()?.id_person)],
            absenceTypeId,
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  protected onSaveSuccess(): void {
    this.toastService.success(
      this.translate.instant('my-absences.confirm.save-success'),
    );
    this.navigateBack();
  }

  protected abstract navigateBack(): void;
}
