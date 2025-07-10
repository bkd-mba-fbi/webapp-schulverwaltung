import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, Subject, combineLatest, of } from "rxjs";
import { filter, finalize, map, switchMap, take } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { isEmptyArray } from "src/app/shared/utils/array";
import { getValidationErrors } from "src/app/shared/utils/form";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  template: "",
})
export abstract class MyAbsencesAbstractConfirmComponent
  implements OnInit, OnDestroy
{
  protected fb = inject(UntypedFormBuilder);
  protected router = inject(Router);
  protected toastService = inject(ToastService);
  protected translate = inject(TranslateService);
  protected presenceTypesService = inject(PresenceTypesService);
  protected updateService = inject(LessonPresencesUpdateRestService);
  protected storageService = inject(StorageService);
  protected settings = inject<Settings>(SETTINGS);

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
    "absenceTypeId",
  );

  abstract titleKey: string;
  abstract selectedLessonIds$: Observable<ReadonlyArray<number>>;
  protected abstract confirmationStateId: Option<number>;

  protected destroy$ = new Subject<void>();

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
      this.translate.instant("my-absences.confirm.save-success"),
    );
    this.navigateBack();
  }

  protected abstract navigateBack(): void;
}
