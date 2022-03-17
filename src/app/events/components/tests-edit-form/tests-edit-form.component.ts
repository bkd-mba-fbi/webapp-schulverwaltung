import { formatPercent, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
})
export class TestsEditFormComponent {
  @Input() courseId: Number;
  @Input() test: Option<Test>;

  formGroup$ = of(this.createFormGroup());

  constructor(private fb: FormBuilder) {}

  private createFormGroup(): FormGroup {
    return this.fb.group({
      designation: ['', Validators.required],
      date: [null, Validators.required],
      factor: [1, Validators.required],
      percentage: [1],
      isPointGrading: [false, Validators.required],
      maxPoints: [null],
      maxPointsAdjusted: [null],
    });
  }
}
