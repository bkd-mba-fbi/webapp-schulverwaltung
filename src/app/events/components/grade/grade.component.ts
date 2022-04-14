import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit {
  @Input() grade: GradeOrNoResult;

  pointsInput = new FormControl({ value: '', disabled: false }, [
    Validators.min(0),
    Validators.pattern('[0-9]+([\\.][0-9]+)?'),
    this.maxPointValidator(),
  ]);

  constructor() {}

  ngOnInit(): void {
    if (this.grade.kind === 'grade') {
      this.pointsInput.setValue(this.grade.result.Points);
    }
  }

  maxPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Number(value) >
        (this.grade?.test.MaxPointsAdjusted || this.grade?.test.MaxPoints!)
        ? { customMax: true }
        : null;
    };
  }
}
