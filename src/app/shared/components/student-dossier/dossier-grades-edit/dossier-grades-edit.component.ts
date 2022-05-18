import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { maxPoints } from 'src/app/events/utils/tests';
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

  updatedTest: UpdatedTestResultResponse;
  maxPoints: number = 0;
  pointsInput: FormControl;

  private gradeSubject$: Subject<number> = new Subject<number>();
  private pointsSubject$: Subject<string> = new Subject<string>();

  closeButtonDisabled$ = new BehaviorSubject<boolean>(false);

  gradingScaleDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  grade$: Observable<number> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME)
  );
  points$: Observable<number> = this.pointsSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
    filter(this.isValid.bind(this)),
    map(Number)
  );

  destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: CoursesRestService
  ) {}

  ngOnInit(): void {
    this.maxPoints = maxPoints(this.test);
    this.pointsInput = new FormControl(
      { value: this.points, disabled: false },
      [
        Validators.min(0),
        Validators.pattern('[0-9]+([\\.][0-9]+)?'),
        this.maxPointValidator(),
      ]
    );
    this.gradingScaleDisabled$.next(
      this.test.IsPointGrading && this.points > 0
    );

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
    this.gradingScaleDisabled$.next(points.length > 0);
  }

  get updatedTestResult(): Option<Result> {
    return this.updatedTest?.TestResults[0];
  }

  private updateTestResult(result: TestPointsResult | TestGradesResult): void {
    this.closeButtonDisabled$.next(true);
    this.courseService
      .updateTestResult(this.test.CourseId, result)
      .subscribe((response) => {
        this.gradeId = response.TestResults[0]?.GradeId;
        this.updatedTest = response;
        this.closeButtonDisabled$.next(false);
      });
  }

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

  private maxPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Number(control.value) > maxPoints(this.test)
        ? { customMax: true }
        : null;
    };
  }
}
