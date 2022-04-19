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

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit, OnDestroy {
  @Input() grade: GradeOrNoResult;
  @Input() student: Student;

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

  destroy$ = new Subject<void>();

  private isValid(points: string): boolean {
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints);
  }

  constructor() {}

  ngOnInit(): void {
    if (this.grade.kind === 'grade') {
      this.pointsInput.setValue(this.grade.result.Points);
    }

    this.maxPoints = toMaxPoints(this.grade);
    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.buildRequestBody.bind(this));
  }

  maxPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Number(control.value) > toMaxPoints(this.grade)
        ? { customMax: true }
        : null;
    };
  }

  onChange(points: string) {
    this.pointsSubject$.next(points);
  }

  private buildRequestBody(points: number) {
    const body: TestPointsResult = {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      Points: points,
    };

    this.savePoints.emit(body);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
