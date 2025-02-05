import { AsyncPipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";
import { BehaviorSubject, Subject, of, takeUntil } from "rxjs";
import { Test } from "src/app/shared/models/test.model";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import {
  getControlValueChanges,
  getValidationErrors,
} from "src/app/shared/utils/form";
import { greaterThanValidator } from "src/app/shared/validators/greater-than.validator";
import { TestStateService } from "../../services/test-state.service";

@Component({
  selector: "bkd-tests-edit-form",
  templateUrl: "./tests-edit-form.component.html",
  styleUrls: ["./tests-edit-form.component.scss"],
  schemas: [NO_ERRORS_SCHEMA], // otherwise html math tags are not allowed using template strict mode
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbInputDatepicker,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
})
export class TestsEditFormComponent implements OnInit, OnDestroy {
  private fb = inject(UntypedFormBuilder);
  private translate = inject(TranslateService);
  private testStateService = inject(TestStateService);

  @Input() test: Option<Test> = null;
  @Input() saving = false;

  @Output() save = new EventEmitter<UntypedFormGroup>();

  componentId = uniqueId("bkd-tests-edit-form");

  formGroup: UntypedFormGroup = this.createFormGroup();
  private submitted$ = new BehaviorSubject(false);
  private destroy$ = new Subject<void>();

  designationErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    "designation",
  );

  dateErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    "date",
  );

  maxPointsErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    "maxPoints",
  );

  maxPointsAdjustedErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    "maxPointsAdjusted",
  );

  weightErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    "weight",
  );

  courseId$ = this.testStateService.courseId$;

  ngOnInit(): void {
    if (this.test) {
      this.setInitialValues(this.test);
    }

    // Disable max points and max points adjusted fields when not point grading type
    getControlValueChanges(of(this.formGroup), "isPointGrading")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.togglePointFieldsDisability.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup.value);
    }
  }

  private createFormGroup(): UntypedFormGroup {
    return this.fb.group({
      designation: ["", Validators.required],
      date: [null, Validators.required],
      weight: [
        1,
        Validators.compose([Validators.required, greaterThanValidator(0)]),
      ],
      isPointGrading: [false],
      maxPoints: [{ value: null, disabled: true }, Validators.required],
      maxPointsAdjusted: [{ value: null, disabled: true }, null],
    });
  }

  private setInitialValues(test: Test) {
    this.formGroup.patchValue({
      designation: test.Designation,
      date: test.Date,
      weight: test.Weight,
      isPointGrading: test.IsPointGrading,
      maxPoints: test.MaxPoints,
      maxPointsAdjusted: test.MaxPointsAdjusted,
    });

    // Disable type selection if test already contains results
    if (test.Results && test.Results.length > 0) {
      this.formGroup.get("isPointGrading")?.disable();
      this.formGroup.get("maxPoints")?.disable();
      this.formGroup.get("maxPointsAdjusted")?.disable();
    }
    this.togglePointFieldsDisability();
  }

  private togglePointFieldsDisability(): void {
    const maxPoints = this.formGroup.get("maxPoints");
    const maxPointsAdjusted = this.formGroup.get("maxPointsAdjusted");
    const isPointGrading = this.formGroup.get("isPointGrading")?.value;

    if (isPointGrading) {
      maxPoints?.enable();
      maxPointsAdjusted?.enable();
    } else {
      maxPoints?.reset({ value: this.test?.MaxPoints, disabled: true });
      maxPointsAdjusted?.reset({
        value: this.test?.MaxPointsAdjusted,
        disabled: true,
      });
    }
  }
}
