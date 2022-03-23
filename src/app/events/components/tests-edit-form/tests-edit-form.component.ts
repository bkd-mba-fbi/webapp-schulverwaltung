import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, finalize, of } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { getValidationErrors } from 'src/app/shared/utils/form';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
})
export class TestsEditFormComponent implements OnInit {
  @Input() courseId: number;
  @Input() test: Option<Test>;

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

  constructor(
    private fb: FormBuilder,
    private courseService: CoursesRestService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.test) {
      this.setInitialValues(this.test);
    }
  }

  // TODO delegate to add component
  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      this.save(this.formGroup);
    }
  }

  private save(formGroup: FormGroup): void {
    this.saving$.next(true);
    const {
      designation,
      date,
      weight,
      isPointGrading,
      maxPoints,
      maxPointsAdjusted,
    } = formGroup.value;
    this.courseService
      .add(
        this.courseId,
        new Date(date),
        designation,
        weight,
        isPointGrading,
        maxPoints,
        maxPointsAdjusted
      )
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.toastr.success(this.translate.instant('tests.form.save-success'));
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['events', this.courseId, 'tests']);
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
