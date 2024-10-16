import { AsyncPipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  filter,
  map,
  takeUntil,
} from "rxjs";
import {
  TestResultGradeUpdate,
  TestResultPointsUpdate,
} from "src/app/events/services/test-state.service";
import { maxPoints } from "src/app/events/utils/tests";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { SelectComponent } from "../../select/select.component";

const DEBOUNCE_TIME = 500;

@Component({
  selector: "bkd-dossier-grades-edit",
  templateUrl: "./dossier-grades-edit.component.html",
  styleUrls: ["./dossier-grades-edit.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class DossierGradesEditComponent implements OnInit {
  @Input() test: Test;
  @Input() gradeId: Option<number>;
  @Input() gradeOptions: Option<DropDownItem[]>;
  @Input() points: number;
  @Input() studentId: number;

  updatedTestResult: Option<Result>;
  maxPoints: number = 0;
  pointsInput: UntypedFormControl;

  private gradeSubject$: Subject<number> = new Subject<number>();
  private pointsSubject$: Subject<string> = new Subject<string>();

  closeButtonDisabled$ = new BehaviorSubject<boolean>(false);

  gradingScaleDisabled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  grade$: Observable<number> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
  );
  points$: Observable<number> = this.pointsSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
    filter(this.isValid.bind(this)),
    map(Number),
  );

  destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: CoursesRestService,
  ) {}

  ngOnInit(): void {
    this.maxPoints = maxPoints(this.test);
    this.pointsInput = new UntypedFormControl(
      { value: this.points, disabled: false },
      [
        Validators.min(0),
        Validators.pattern("[0-9]+([\\.][0-9]+)?"),
        this.maxPointValidator(),
      ],
    );
    this.gradingScaleDisabled$.next(
      this.test.IsPointGrading && this.points > 0,
    );

    this.points$.pipe(takeUntil(this.destroy$)).subscribe((points) =>
      this.updateTestResult({
        studentId: this.studentId,
        testId: this.test.Id,
        points,
      }),
    );

    this.grade$.pipe(takeUntil(this.destroy$)).subscribe((gradeId) =>
      this.updateTestResult({
        studentId: this.studentId,
        testId: this.test.Id,
        gradeId,
      }),
    );
  }

  onGradeChange(gradeId: number): void {
    this.gradeSubject$.next(gradeId);
  }

  onPointsChange(points: string): void {
    this.pointsSubject$.next(points);
    this.gradingScaleDisabled$.next(points.length > 0);
  }

  private updateTestResult(
    update: TestResultGradeUpdate | TestResultPointsUpdate,
  ): void {
    this.closeButtonDisabled$.next(true);
    this.courseService
      .updateTestResult(this.test.CourseId, update)
      .subscribe(({ testResult }) => {
        this.gradeId = testResult?.GradeId ?? null;
        this.updatedTestResult = testResult;
        this.closeButtonDisabled$.next(false);
      });
  }

  private isValid(points: string): boolean {
    if (points === "") return false;
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
