import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, Subject, combineLatest } from "rxjs";
import {
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { DropDownItemsRestService } from "src/app/shared/services/drop-down-items-rest.service";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { findDropDownItem$ } from "src/app/shared/utils/drop-down-items";
import { notNull } from "src/app/shared/utils/filter";
import {
  getControl,
  getControlValueChanges,
  getValidationErrors,
} from "src/app/shared/utils/form";
import { LessonPresence } from "../../models/lesson-presence.model";
import { ConfirmAbsencesSelectionService } from "../../services/confirm-absences-selection.service";
import { ToastService } from "../../services/toast.service";
import {
  CONFIRM_ABSENCES_SERVICE,
  IConfirmAbsencesService,
} from "../../tokens/confirm-absences-service";

@Component({
  selector: "bkd-confirm-absences",
  templateUrl: "./confirm-absences.component.html",
  styleUrls: ["./confirm-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ConfirmAbsencesComponent implements OnInit, OnDestroy {
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private selectionService = inject(ConfirmAbsencesSelectionService);
  private dropDownItemsService = inject(DropDownItemsRestService);
  private presenceTypesService = inject(PresenceTypesService);
  private updateService = inject(LessonPresencesUpdateRestService);
  private settings = inject<Settings>(SETTINGS);
  private openAbsencesEditService = inject<IConfirmAbsencesService>(
    CONFIRM_ABSENCES_SERVICE,
    { optional: true },
  );

  formGroup$ = this.selectionService.selectedWithoutPresenceType$.pipe(
    map(this.createFormGroup.bind(this)),
    shareReplay(1),
  );

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  formErrors$ = getValidationErrors(this.formGroup$, this.submitted$);
  absenceTypeIdErrors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "absenceTypeId",
  );

  private confirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(shareReplay(1));

  excusedState$ = findDropDownItem$(
    this.confirmationStates$,
    this.settings.excusedAbsenceStateId,
  );
  unexcusedState$ = findDropDownItem$(
    this.confirmationStates$,
    this.settings.unexcusedAbsenceStateId,
  );

  absenceTypes$ = this.presenceTypesService.confirmationTypes$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.selectionService.selectedIds$
      .pipe(take(1))
      .subscribe((selectedIds) => {
        if (selectedIds.length === 0) {
          // Nothing to confirm if no entries are selected
          this.navigateBack();
        }
      });

    // Disable confirmation value select when unexcused
    getControlValueChanges(this.formGroup$, "confirmationValue")
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (typeof value === "number") {
          this.updateAbsenceTypeIdDisabled(value);
        }
      });

    // Disable form when saving
    combineLatest([
      getControl(this.formGroup$, "confirmationValue").pipe(filter(notNull)),
      getControl(this.formGroup$, "absenceTypeId").pipe(filter(notNull)),
      this.saving$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([confirmationValueControl, absenceTypeIdControl, saving]) => {
        if (saving) {
          confirmationValueControl.disable();
          absenceTypeIdControl.disable();
        } else {
          confirmationValueControl.enable();
          this.updateAbsenceTypeIdDisabled(confirmationValueControl.value);
        }
      });

    // Initially select excused state radio button
    combineLatest([
      getControl(this.formGroup$, "confirmationValue").pipe(filter(notNull)),
      this.excusedState$.pipe(take(1), filter(notNull)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([confirmationValueControl, excusedState]) =>
        confirmationValueControl.setValue(excusedState.Key),
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSubmit(): void {
    this.submitted$.next(true);
    this.formGroup$.pipe(take(1)).subscribe((formGroup) => {
      if (formGroup.valid) {
        const { confirmationValue, absenceTypeId } = formGroup.value;
        this.save(confirmationValue, absenceTypeId);
      }
    });
  }

  cancel(): void {
    this.navigateBack();
  }

  getSelectedCount(): Observable<number> {
    return this.selectionService.selectedLessons$.pipe(
      map((lessons) => lessons.length),
    );
  }

  private createFormGroup(
    selectedWithoutPresenceType: ReadonlyArray<LessonPresence>,
  ): UntypedFormGroup {
    return selectedWithoutPresenceType.length > 0
      ? this.fb.group({
          confirmationValue: [null],
          absenceTypeId: [null, Validators.required],
        })
      : this.fb.group({
          confirmationValue: [null],
        });
  }

  private updateAbsenceTypeIdDisabled(confirmationValue: number): void {
    combineLatest([
      getControl(this.formGroup$, "absenceTypeId").pipe(
        take(1),
        filter(notNull),
      ),
      this.excusedState$.pipe(take(1), filter(notNull)),
    ]).subscribe(([absenceTypeIdControl, excusedState]) => {
      if (confirmationValue === excusedState.Key) {
        absenceTypeIdControl.enable();
      } else {
        absenceTypeIdControl.disable();
      }
    });
  }

  private save(confirmationValue: number, absenceTypeId: number): void {
    this.saving$.next(true);

    combineLatest([
      this.selectionService.selectedIds$.pipe(take(1)),
      this.unexcusedState$.pipe(take(1), filter(notNull)),
    ])
      .pipe(
        switchMap(([selectedIds, unexcusedState]) =>
          combineLatest(
            selectedIds.map(({ lessonIds, personId, presenceTypeId }) =>
              this.updateService.confirmLessonPresences(
                lessonIds,
                [personId],
                this.getNewAbsenceTypeId(
                  presenceTypeId,
                  confirmationValue,
                  Number(unexcusedState.Key),
                  absenceTypeId,
                ),
                confirmationValue,
              ),
            ),
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private getNewAbsenceTypeId(
    currentAbsenceTypeId: Option<number>,
    confirmationValue: number,
    unexcusedState: number,
    absenceTypeId: number,
  ): number {
    if (!currentAbsenceTypeId) {
      throw new Error("absence type id cannot be null");
    }

    if (confirmationValue === unexcusedState) {
      return this.settings.absencePresenceTypeId;
    }

    return currentAbsenceTypeId === this.settings.absencePresenceTypeId
      ? absenceTypeId
      : currentAbsenceTypeId;
  }

  private onSaveSuccess(): void {
    if (this.openAbsencesEditService?.updateAfterConfirm) {
      this.openAbsencesEditService.updateAfterConfirm();
    }
    this.toastService.success(
      this.translate.instant("open-absences.edit.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    void this.router.navigate(
      this.openAbsencesEditService?.confirmBackLink || [".."],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.openAbsencesEditService?.confirmBackLinkParams,
      },
    );
  }
}
