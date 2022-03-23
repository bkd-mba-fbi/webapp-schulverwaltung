import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { getValidationErrors } from 'src/app/shared/utils/form';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
})
export class TestsEditFormComponent implements OnInit {
  @Input() courseId: number;
  @Input() test: Option<Test>;

  @Output() save = new EventEmitter<FormGroup>(); // TODO map to test model?

  formGroup: FormGroup = this.createFormGroup();
  private submitted$ = new BehaviorSubject(false);
  saving$ = new BehaviorSubject(false);

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.test) {
      this.setInitialValues(this.test);
    }
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup);
    }
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      designation: ['', Validators.required],
      date: [null], // TODO required, enable validation for date select component
      weight: [1],
      weightPercent: [1],
      isPointGrading: [false],
      maxPoints: [null], // TODO required if is point grading
      maxPointsAdjusted: [null],
    });
  }

  private setInitialValues(test: Test) {
    this.formGroup.patchValue({
      designation: test.Designation,
      date: {
        day: test.Date.getDate(),
        month: test.Date.getMonth() + 1,
        year: test.Date.getFullYear(),
      },
      weight: test.Weight,
      weightPercent: test.WeightPercent,
      isPointGrading: test.IsPointGrading,
      maxPoints: test.MaxPoints,
      maxPointsAdjusted: test.MaxPointsAdjusted,
    });
  }
}
