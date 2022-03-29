import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject, takeUntil } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import {
  getControlValueChanges,
  getValidationErrors,
} from 'src/app/shared/utils/form';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
})
export class TestsEditFormComponent implements OnInit, OnDestroy {
  @Input() courseId: number;
  @Input() test: Option<Test>;
  @Input() saving: boolean;

  @Output() save = new EventEmitter<FormGroup>();

  formGroup: FormGroup = this.createFormGroup();
  private submitted$ = new BehaviorSubject(false);
  private destroy$ = new Subject<void>();

  designationErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    'designation'
  );

  dateErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    'date'
  );

  maxPointsErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    'maxPoints'
  );

  weightErrors$ = getValidationErrors(
    of(this.formGroup),
    this.submitted$,
    'weight'
  );

  constructor(private fb: FormBuilder, private translate: TranslateService) {}

  ngOnInit(): void {
    if (this.test) {
      this.setInitialValues(this.test);
    }

    // Disable max points and max points adjusted fields when not point grading type
    getControlValueChanges(of(this.formGroup), 'isPointGrading')
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

  private createFormGroup(): FormGroup {
    return this.fb.group({
      designation: ['', Validators.required],
      date: [null, Validators.required],
      weight: [1, Validators.required],
      weightPercent: [1],
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
      weightPercent: test.WeightPercent,
      isPointGrading: test.IsPointGrading,
      maxPoints: test.MaxPoints,
      maxPointsAdjusted: test.MaxPointsAdjusted,
    });

    // Disable type selection if test already contains results
    if (test.Results && test.Results.length > 0) {
      this.formGroup.get('isPointGrading')?.disable();
      this.formGroup.get('maxPoints')?.disable();
      this.formGroup.get('maxPointsAdjusted')?.disable();
    }
    this.togglePointFieldsDisability();
  }

  private togglePointFieldsDisability(): void {
    const maxPoints = this.formGroup.get('maxPoints');
    const maxPointsAdjusted = this.formGroup.get('maxPointsAdjusted');
    const isPointGrading = this.formGroup.get('isPointGrading')?.value;

    if (isPointGrading) {
      maxPoints?.enable();
      maxPointsAdjusted?.enable();
    } else {
      maxPoints?.reset({ value: null, disabled: true });
      maxPointsAdjusted?.reset({ value: null, disabled: true });
    }
  }
}
