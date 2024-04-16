import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";
import { BehaviorSubject, Subject, of, takeUntil } from "rxjs";
import { Test } from "src/app/shared/models/test.model";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import {
  getControlValueChanges,
  getValidationErrors,
} from "src/app/shared/utils/form";
import { greaterThanValidator } from "src/app/shared/validators/greater-than.validator";
import { LetDirective } from "../../../shared/directives/let.directive";
import { TestStateService } from "../../services/test-state.service";

@Component({
  selector: "erz-tests-edit-form",
  templateUrl: "./tests-edit-form.component.html",
  styleUrls: ["./tests-edit-form.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgbInputDatepicker,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
export class TestsEditFormComponent implements OnInit, OnDestroy {
  @Input() test: Option<Test> = null;
  @Input() saving = false;

  @Output() save = new EventEmitter<UntypedFormGroup>();

  componentId = uniqueId("erz-tests-edit-form");

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

  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private testStateService: TestStateService,
  ) {}

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
