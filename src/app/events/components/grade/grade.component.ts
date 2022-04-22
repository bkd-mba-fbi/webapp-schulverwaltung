import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  GradeOrNoResult,
  toMaxPoints,
} from 'src/app/shared/models/student-grades';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { TestPointsResult } from '../../../shared/models/course.model';
import { Student } from '../../../shared/models/student.model';
import { DropDownItem } from '../../../shared/models/drop-down-item.model';
import { TestEditGradesStateService } from '../../services/test-edit-grades-state.service';

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit, OnDestroy {
  @Input() grade: GradeOrNoResult;
  @Input() student: Student;
  @Input() tabIndex: number;

  @Output()
  savePoints = new EventEmitter<TestPointsResult>();

  pointsInput = new FormControl({ value: '', disabled: false }, [
    Validators.min(0),
    Validators.pattern('[0-9]+([\\.][0-9]+)?'),
    this.maxPointValidator(),
  ]);

  maxPoints: number = 0;

  private pointsSubject$: Subject<string> = new Subject<string>();

  points$: Observable<number> = this.pointsSubject$.pipe(
    debounceTime(500),
    filter(this.isValid.bind(this)),
    map(Number)
  );

  private gradingScale$ = this.state.gradingScales$.pipe(
    map((gradingScales) =>
      gradingScales.find(
        (gradingScale) => gradingScale.Id === this.grade.test.GradingScaleId
      )
    )
  );

  gradeOptions$ = this.gradingScale$.pipe(
    map((gradingScale) =>
      gradingScale?.Grades.map((grade) => {
        return { Key: grade.Id, Value: grade.Designation };
      })
    )
  );

  destroy$ = new Subject<void>();

  constructor(public state: TestEditGradesStateService) {}

  ngOnInit(): void {
    if (this.grade.kind === 'grade') {
      this.pointsInput.setValue(this.grade.result.Points);
    }

    this.maxPoints = toMaxPoints(this.grade);
    this.points$
      .pipe(takeUntil(this.destroy$), map(this.buildRequestBody.bind(this)))
      .subscribe((body) => this.savePoints.emit(body));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onChange(points: string) {
    this.pointsSubject$.next(points);
  }

  private maxPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Number(control.value) > toMaxPoints(this.grade)
        ? { customMax: true }
        : null;
    };
  }

  private isValid(points: string): boolean {
    if (points === '') return false;
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints);
  }

  private buildRequestBody(points: number): TestPointsResult {
    return {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      Points: points,
    };
  }
}
