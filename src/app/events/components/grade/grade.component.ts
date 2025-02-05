import { AsyncPipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  inject,
  input,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  concatMap,
  debounceTime,
  filter,
  map,
  takeUntil,
} from "rxjs/operators";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import {
  GradeOrNoResult,
  toMaxPoints,
} from "src/app/shared/models/student-grades";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { Student } from "../../../shared/models/student.model";
import {
  TestResultGradeUpdate,
  TestResultPointsUpdate,
  TestStateService,
} from "../../services/test-state.service";

const DEBOUNCE_TIME = 1250;

@Component({
  selector: "bkd-grade",
  templateUrl: "./grade.component.html",
  styleUrls: ["./grade.component.scss"],
  imports: [FormsModule, SelectComponent, AsyncPipe, TranslatePipe],
})
export class GradeComponent implements OnInit, OnDestroy, OnChanges {
  private state = inject(TestStateService);

  @Input() grade: GradeOrNoResult;
  @Input() student: Student;
  readonly tabIndex = input<number>();
  @Input() gradeOptions: DropDownItem[];

  maxPoints: number = 0;

  private pointsSubject$ = new Subject<string>();
  private gradeSubject$ = new Subject<Option<number>>();
  private gradingScaleDisabledSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  gradingScaleDisabled$ = this.gradingScaleDisabledSubject$.asObservable();

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.gradingScaleDisabledSubject$.next(this.disableGradingScale());

    this.maxPoints = toMaxPoints(this.grade);
    this.initSave(
      this.pointsSubject$.pipe(
        filter(this.isValid.bind(this)),
        map((points) => ({
          studentId: this.student.Id,
          testId: this.grade.test.Id,
          points: points ? Number(points) : null,
        })),
      ),
    );
    this.initSave(
      this.gradeSubject$.pipe(
        map((gradeId) => ({
          studentId: this.student.Id,
          testId: this.grade.test.Id,
          gradeId,
        })),
      ),
    );
  }

  ngOnChanges() {
    this.gradingScaleDisabledSubject$.next(this.disableGradingScale());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onPointsChange(points: string) {
    this.pointsSubject$.next(points);
    this.gradingScaleDisabledSubject$.next(!(points === null || points === ""));
  }

  onGradeChange(gradeId: Option<number>) {
    this.gradeSubject$.next(gradeId);
  }

  private isValid(points: string): boolean {
    if (points === "" || points === null) return true;
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints);
  }

  private initSave(
    source$: Observable<TestResultGradeUpdate | TestResultPointsUpdate>,
  ): void {
    source$
      .pipe(
        // Propagate the optimistic update of the local state right-away (before
        // debounce), to avoid flickering back to old value
        concatMap((params) =>
          this.state
            .optimisticallyUpdateGrade(params)
            .pipe(map((originalResult) => ({ params, originalResult }))),
        ),
        debounceTime(DEBOUNCE_TIME), // We want the saving itself to be debounced
        takeUntil(this.destroy$),
      )
      .subscribe(({ params, originalResult }) =>
        this.state.saveGrade(params, originalResult),
      );
  }

  private disableGradingScale() {
    if (this.grade.test.IsPublished) return true;
    if (this.grade.kind === "no-result") return false;
    return this.grade.result.Points != null && this.grade.test.IsPointGrading;
  }
}
