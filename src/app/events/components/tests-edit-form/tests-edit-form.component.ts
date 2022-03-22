import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
})
export class TestsEditFormComponent implements OnInit {
  @Input() courseId: Number;
  @Input() test: Option<Test>;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.createFormGroup(this.test);
  }

  private createFormGroup(test: Option<Test>): FormGroup {
    let fg = this.fb.group({
      Designation: ['', Validators.required],
      Date: [null, Validators.required],
      Weight: [1, Validators.required],
      WeightPercent: [1],
      IsPointGrading: [false, Validators.required],
      MaxPoints: [null],
      MaxPointsAdjusted: [null],
    });

    if (test) {
      fg.patchValue(test);
      fg.controls.Date.setValue({
        day: test.Date.getDate(),
        month: test.Date.getMonth() + 1,
        year: test.Date.getFullYear(),
      });
    }

    return fg;
  }
}
