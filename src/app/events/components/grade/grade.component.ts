import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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

const DEBOUNCE_TIME = 1250;

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

  maxPoints: number = 0;

  private pointsSubject$: Subject<string> = new Subject<string>();
  private gradeSubject$: Subject<number> = new Subject<number>();
  private gradingScaleDisabledSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  gradingScaleDisabled$ = this.gradingScaleDisabledSubject$.asObservable();

  points$: Observable<string | null> = this.pointsSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
    filter(this.isValid.bind(this))
  );

  grade$: Observable<number> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME)
  );

  destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
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
        map(this.buildRequestBodyForGradeChange.bind(this))
      )
      .subscribe((body) => this.gradeChanged.emit(body));
  }

  ngOnChanges() {
    this.gradingScaleDisabledSubject$.next(this.disableGradingScale());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onPointsChange(points: string) {
    this.pointsSubject$.next(points);
    this.gradingScaleDisabledSubject$.next(!(points === null || points === ''));
  }

  onGradeChange(gradeId: number) {
    this.gradeSubject$.next(gradeId);
  }

  private isValid(points: string): boolean {
    if (points === '' || points === null) return true;
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints);
  }

  private buildRequestBodyPointsChange(
    points: string | null
  ): TestPointsResult {
    const newPoints = points === null || points === '' ? null : Number(points);
    return {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      Points: newPoints,
    };
  }

  private buildRequestBodyForGradeChange(gradeId: number): TestGradesResult {
    return {
      StudentIds: [this.student.Id],
      TestId: this.grade.test.Id,
      GradeId: gradeId,
    };
  }

  private disableGradingScale() {
    if (this.grade.test.IsPublished) return true;
    if (this.grade.kind === 'no-result') return false;
    return this.grade.result.Points != null && this.grade.test.IsPointGrading;
  }
}
