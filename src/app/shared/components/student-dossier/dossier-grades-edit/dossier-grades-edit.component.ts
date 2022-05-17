import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import {
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { Result, Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'erz-dossier-grades-edit',
  templateUrl: './dossier-grades-edit.component.html',
  styleUrls: ['./dossier-grades-edit.component.scss'],
})
export class DossierGradesEditComponent implements OnInit {
  @Input() test: Test;
  @Input() gradeId: Option<number>;
  @Input() gradeOptions: Option<DropDownItem[]>;
  @Input() points: number;
  @Input() studentId: number;

  response: UpdatedTestResultResponse;
  maxPoints: number = 0;

  private gradeSubject$: Subject<number> = new Subject<number>();
  private pointsSubject$: Subject<string> = new Subject<string>();

  grade$: Observable<number> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME)
  );

  points$: Observable<number> = this.pointsSubject$.pipe(
    tap((n) => console.log('a', n)),
    debounceTime(DEBOUNCE_TIME),
    tap((n) => console.log('b', n)),
    filter(this.isValid.bind(this)),
    tap((n) => console.log('c', n)),
    map(Number),
    tap((n) => console.log('z', n))
  );

  destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: CoursesRestService
  ) {}

  ngOnInit(): void {
    this.maxPoints = this.test.MaxPointsAdjusted || this.test.MaxPoints!; // TODO dry up

    this.grade$
      .pipe(
        takeUntil(this.destroy$),
        map(this.buildRuequestBodyForGradeChange.bind(this))
      )
      .subscribe((body) => this.updateTestResult(body));

    this.points$
      .pipe(
        takeUntil(this.destroy$),
        map(this.buildRequestBodyPointsChange.bind(this))
      )
      .subscribe((body) => this.updateTestResult(body));
  }

  onGradeChange(gradeId: number): void {
    this.gradeSubject$.next(gradeId);
  }

  onPointsChange(points: string): void {
    this.pointsSubject$.next(points);
  }

  get updatedTestResult(): Option<Result> {
    return this.response?.TestResults[0];
  }

  private updateTestResult(result: TestPointsResult | TestGradesResult): void {
    this.courseService
      .updateTestResult(this.test.CourseId, result)
      .subscribe((body) => {
        this.response = body;
      });
  }

  // TODO dry up ---------------------------------------------------------
  private buildRuequestBodyForGradeChange(gradeId: number): TestGradesResult {
    return {
      StudentIds: [this.studentId],
      TestId: this.test.Id,
      GradeId: gradeId,
    };
  }

  private buildRequestBodyPointsChange(points: number): TestPointsResult {
    return {
      StudentIds: [this.studentId],
      TestId: this.test.Id,
      Points: points,
    };
  }

  private isValid(points: string): boolean {
    if (points === '') return false;
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints);
  }
}
