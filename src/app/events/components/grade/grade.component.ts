import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import {
  GradeOrNoResult,
  toMaxPoints,
} from 'src/app/shared/models/student-grades';
import {
  TestGradesResult,
  TestPointsResult,
} from '../../../shared/models/course.model';
import { Student } from '../../../shared/models/student.model';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() grade: GradeOrNoResult;
  @Input() student: Student;
  @Input() tabIndex: number;
  @Input() gradeOptions: DropDownItem[];

  @Output()
  gradeChanged = new EventEmitter<TestPointsResult | TestGradesResult>();

  pointsInput = new FormControl({ value: '', disabled: false }, [
    Validators.min(0),
    Validators.pattern('[0-9]+([\\.][0-9]+)?'),
    this.maxPointValidator(),
  ]);

  maxPoints: number = 0;

  private pointsSubject$: Subject<string> = new Subject<string>();
  private gradeSubject$: Subject<number> = new Subject<number>();
  private gradingScaleDisabledSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  gradingScaleDisabled$ = this.gradingScaleDisabledSubject$.asObservable();

  points$: Observable<number> = this.pointsSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
    filter(this.isValid.bind(this)),
    map(Number)
  );

  grade$: Observable<number> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME)
  );

  destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    if (this.grade.kind === 'grade') {
      this.pointsInput.setValue(this.grade.result.Points);
    }
    this.gradingScaleDisabledSubject$.next(this.disableGradingScale());

    this.maxPoints = toMaxPoints(this.grade);
    this.points$
      .pipe(
        takeUntil(this.destroy$),
        map(this.buildRequestBodyPointsChange.bind(this))
      )
      .subscribe((body) => this.gradeChanged.emit(body));

    this.grade$
      .pipe(
        takeUntil(this.destroy$),
        map(this.buildRuequestBodyForGradeChange.bind(this))
      )
      .subscribe((body) => this.gradeChanged.emit(body));
  }

  ngOnChanges() {
    if (this.grade.kind === 'grade')
      this.pointsInput.setValue(this.grade.result.Points);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onPointsChange(points: string) {
    this.pointsSubject$.next(points);
    this.gradingScaleDisabledSubject$.next(points.length > 0);
  }

  onGradeChange(gradeId: number) {
    this.gradeSubject$.next(gradeId);
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

  private buildRequestBodyPointsChange(points: number): TestPointsResult {
    return {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      Points: points,
    };
  }

  private buildRuequestBodyForGradeChange(gradeId: number): TestGradesResult {
    return {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      GradeId: gradeId,
    };
  }

  private disableGradingScale() {
    if (this.grade.kind === 'no-result') return false;
    return this.grade.result.Points != null && this.grade.test.IsPointGrading;
  }
}
