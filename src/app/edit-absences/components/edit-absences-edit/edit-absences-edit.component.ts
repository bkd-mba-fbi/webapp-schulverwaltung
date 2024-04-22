import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { uniq } from "lodash-es";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { DropDownItemsRestService } from "src/app/shared/services/drop-down-items-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import {
  getControlValueChanges,
  getValidationErrors,
} from "src/app/shared/utils/form";
import { parseQueryString } from "src/app/shared/utils/url";
import { LetDirective } from "../../../shared/directives/let.directive";
import { ToastService } from "../../../shared/services/toast.service";
import { EditAbsencesStateService } from "../../services/edit-absences-state.service";
import {
  Category,
  EditAbsencesUpdateService,
} from "../../services/edit-absences-update.service";

@Component({
  selector: "bkd-edit-absences-edit",
  templateUrl: "./edit-absences-edit.component.html",
  styleUrls: ["./edit-absences-edit.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    TranslateModule,
  ],
})
export class EditAbsencesEditComponent implements OnInit, OnDestroy {
  absenceTypes$ = this.presenceTypesService.confirmationTypes$;
  incidents$ = this.presenceTypesService.incidentTypes$;

  formGroup$ = this.createFormGroup();

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  formErrors$ = getValidationErrors(this.formGroup$, this.submitted$);
  absenceTypeIdErrors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "absenceTypeId",
  );
  incidentIdErrors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "incidentId",
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

  // Remove Category HalfDay if the corresponding PresenceType is inactive
  activeCategories$ = this.presenceTypesService.halfDayActive$.pipe(
    map((halfDayActive) =>
      halfDayActive
        ? this.availableCategories
        : this.availableCategories.filter((c) => c !== Category.HalfDay),
    ),
  );

  private destroy$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private translate: TranslateService,
    private state: EditAbsencesStateService,
    private dropDownItemsService: DropDownItemsRestService,
    private presenceTypesService: PresenceTypesService,
    private updateService: EditAbsencesUpdateService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  ngOnInit(): void {
    if (this.state.selected.length === 0) {
      // Nothing to confirm if no entries are selected
      this.navigateBack();
    }

    // Disable confirmation value radios and absence type/incident
    // select when not absent
    getControlValueChanges(this.formGroup$, "category")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateConfirmationValueDisabled.bind(this));

    // Disable absence type select when not excused
    getControlValueChanges(this.formGroup$, "confirmationValue")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateAbsenceTypeIdDisabled.bind(this));
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
    this.formGroup$.pipe(take(1)).subscribe((formGroup) => {
      if (formGroup.valid) {
        this.save(formGroup);
      }
    });
  }

  cancel(): void {
    this.navigateBack();
  }

  private createFormGroup(): Observable<UntypedFormGroup> {
    return this.getInitialAbsenceTypeId().pipe(
      map((initialAbsenceTypeId) =>
        this.fb.group({
          category: [Category.Absent, Validators.required],
          confirmationValue: [
            this.settings.excusedAbsenceStateId,
            Validators.required,
          ],
          absenceTypeId: [initialAbsenceTypeId, Validators.required],
          incidentId: [{ value: null, disabled: true }, Validators.required],
        }),
      ),
      shareReplay(1),
    );
  }

  private getInitialAbsenceTypeId(): Observable<Option<number>> {
    return this.absenceTypes$.pipe(
      take(1),
      map((absenceTypes) => {
        const availableTypeIds = absenceTypes.map((t) => t.Id);
        const selectedTypeIds = uniq(
          this.state.selected.map((e) => e.TypeRef.Id),
        );
        return selectedTypeIds.length === 1 &&
          selectedTypeIds[0] != null &&
          availableTypeIds.includes(selectedTypeIds[0])
          ? selectedTypeIds[0]
          : null;
      }),
    );
  }

  private updateConfirmationValueDisabled(): void {
    this.formGroup$.pipe(take(1)).subscribe((formGroup) => {
      const categoryControl = formGroup.get("category");
      const confirmationValueControl = formGroup.get("confirmationValue");
      const absenceTypeIdControl = formGroup.get("absenceTypeId");
      const incidentIdControl = formGroup.get("incidentId");
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
    });
  }

  private updateAbsenceTypeIdDisabled(): void {
    this.formGroup$.pipe(take(1)).subscribe((formGroup) => {
      const confirmationValueControl = formGroup.get("confirmationValue");
      const absenceTypeIdControl = formGroup.get("absenceTypeId");
      if (confirmationValueControl && absenceTypeIdControl) {
        confirmationValueControl.value === this.settings.excusedAbsenceStateId
          ? absenceTypeIdControl.enable()
          : absenceTypeIdControl.disable();
      }
    });
  }

  private save(formGroup: UntypedFormGroup): void {
    this.saving$.next(true);
    const { category, confirmationValue, absenceTypeId, incidentId } =
      formGroup.value;
    this.presenceTypesService.presenceTypes$
      .pipe(
        switchMap((presenceTypes) =>
          this.updateService.update(
            this.state.selected,
            presenceTypes,
            category,
            confirmationValue,
            absenceTypeId,
            incidentId,
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.state.resetSelection();
    this.toastService.success(
      this.translate.instant("edit-absences.edit.save-success"),
    );
    this.navigateBack(true);
  }

  private navigateBack(reload?: true): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.router.navigate(["/edit-absences"], {
        queryParams: {
          ...parseQueryString(params["returnparams"]),
          reload, // Make sure the entries get reloaded when returning to the list
        },
      });
    });
  }

  private sortAbsenceConfirmationStates(
    states: ReadonlyArray<DropDownItem>,
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
