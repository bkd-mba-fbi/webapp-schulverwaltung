import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
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
import { TranslatePipe } from "@ngx-translate/core";
import {
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
import {
  maxPoints,
  maxPointsAdjusted,
  resultOfStudent,
} from "src/app/events/utils/tests";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { SelectComponent } from "../../select/select.component";

const DEBOUNCE_TIME = 500;

@Component({
  selector: "bkd-student-grades-edit-dialog",
  templateUrl: "./student-grades-edit-dialog.component.html",
  styleUrls: ["./student-grades-edit-dialog.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, SelectComponent, TranslatePipe],
})
export class StudentGradesEditDialogComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private courseService = inject(CoursesRestService);

  readonly test = input.required<Test>();
  readonly gradeId = model<Option<number>>(null);
  readonly gradeOptions = input<Option<DropDownItem[]>>(null);
  readonly points = input<Option<number>>(null);
  readonly studentId = input.required<number>();

  readonly closeButtonDisabled: WritableSignal<boolean> = signal(false);

  readonly updatedTestResult = linkedSignal<Option<Result>>(() => {
    const test = this.test();
    return (test && resultOfStudent(this.studentId(), test)) ?? null;
  });
  readonly maxPoints = computed<number>(() => {
    const test = this.test();
    return test ? maxPoints(test) : 0;
  });
  readonly maxPointsAdjusted = computed<number>(() => {
    const test = this.test();
    return test ? maxPointsAdjusted(test) : 0;
  });

  pointsInput: UntypedFormControl;

  private gradeSubject$: Subject<Option<number>> = new Subject<
    Option<number>
  >();
  private pointsSubject$: Subject<string> = new Subject<string>();

  updatedGrade$: Observable<Option<number>> = this.gradeSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
  );
  updatedPoints$: Observable<number> = this.pointsSubject$.pipe(
    debounceTime(DEBOUNCE_TIME),
    filter(this.isValid.bind(this)),
    map(Number),
  );
  private readonly updatedPointsFromObservable = toSignal(this.updatedPoints$);
  readonly updatedPoints = computed(
    () => this.updatedPointsFromObservable() ?? this.points() ?? 0,
  );
  readonly gradingScaleDisabled = computed(
    () => this.test()?.IsPointGrading && this.updatedPoints() > 0,
  );

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.pointsInput = new UntypedFormControl(
      { value: this.points(), disabled: false },
      [
        Validators.min(0),
        Validators.pattern("[0-9]+([\\.][0-9]+)?"),
        this.maxPointValidator(),
      ],
    );

    this.updatedPoints$.pipe(takeUntil(this.destroy$)).subscribe((points) => {
      const test = this.test();
      if (!test) return;

      this.updateTestResult({
        studentId: this.studentId(),
        testId: test.Id,
        points,
      });
    });

    this.updatedGrade$.pipe(takeUntil(this.destroy$)).subscribe((gradeId) => {
      const test = this.test();
      if (!test) return;

      this.updateTestResult({
        studentId: this.studentId(),
        testId: test.Id,
        gradeId,
      });
    });
  }

  onGradeChange(gradeId: Option<DropDownItem["Key"]>): void {
    this.gradeSubject$.next(gradeId == null ? null : Number(gradeId));
  }

  onPointsChange(points: string): void {
    this.pointsSubject$.next(points);
  }

  isGreaterThanMaxPointsAdjusted(points: string): boolean {
    const pointsValue = Number(points);
    return (
      this.maxPointsAdjusted() > 0 &&
      pointsValue > this.maxPointsAdjusted() &&
      pointsValue <= this.maxPoints()
    );
  }

  close(): void {
    this.activeModal.close(this.updatedTestResult());
  }

  private updateTestResult(
    update: TestResultGradeUpdate | TestResultPointsUpdate,
  ): void {
    const test = this.test();
    if (!test) return;

    this.closeButtonDisabled.set(true);
    this.courseService
      .updateTestResult(test.CourseId, update)
      .subscribe(({ testResult }) => {
        this.gradeId.set(testResult?.GradeId ?? null);
        this.updatedTestResult.set(testResult);
        this.closeButtonDisabled.set(false);
      });
  }

  private isValid(points: string): boolean {
    if (points === "") return false;
    if (isNaN(Number(points))) return false;
    return !(Number(points) < 0 || Number(points) > this.maxPoints());
  }

  private maxPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Number(control.value) > this.maxPoints()
        ? { customMax: true }
        : null;
    };
  }
}
