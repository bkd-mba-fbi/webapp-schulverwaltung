import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import isEqual from "lodash-es/isEqual";
import uniq from "lodash-es/uniq";
import { Observable, filter, finalize, map, switchMap } from "rxjs";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { LoadingService } from "src/app/shared/services/loading-service";
import { ToastService } from "src/app/shared/services/toast.service";
import {
  EventsStudentsStateService,
  StudentEntry,
} from "../../services/events-students-state.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";
import {
  StudyCourseStatus,
  StudyCourseStatusService,
} from "../../services/study-course-status.service";

@Component({
  selector: "bkd-events-students-study-course-edit",
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, SpinnerComponent],
  templateUrl: "./events-students-study-course-edit.component.html",
  styleUrl: "./events-students-study-course-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseEditComponent {
  selected = toSignal(this.selectionService.selection$, {
    initialValue: [],
  });
  selectedIds = toSignal(this.selectionService.selectedIds$, {
    initialValue: [],
  });
  isStatusUnique = computed(
    () => uniq(this.selected().map(({ statusId }) => statusId)).length === 1,
  );
  currentStatus = computed<Option<StudyCourseStatus>>(() => {
    const current = this.selected()[0];
    return current?.statusId && current?.status
      ? { id: current.statusId, name: current.status }
      : null;
  });
  availableStatus = toSignal(this.loadAvailableStatus(), {
    initialValue: [],
  });
  isTerminalStatus = computed(() =>
    isEqual(this.availableStatus(), [this.currentStatus()]),
  );

  formGroup = computed(() =>
    this.createFormGroup(this.currentStatus()?.id ?? null),
  );
  isDirty = toSignal(
    toObservable(this.formGroup).pipe(
      filter(Boolean),
      switchMap(({ valueChanges }) => valueChanges),
      map(({ statusId }) => statusId !== this.currentStatus()?.id),
    ),
  );

  loading = toSignal(this.loadingService.loading(), { initialValue: false });
  saving = signal(false);
  canSave = computed(
    () =>
      this.isStatusUnique() &&
      !this.isTerminalStatus() &&
      !this.saving() &&
      this.isDirty(),
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private studyCourseStatusService: StudyCourseStatusService,
    private stateService: EventsStudentsStateService,
    public selectionService: StudyCourseSelectionService,
  ) {
    effect(() => {
      if (this.selectedIds().length === 0) {
        // No selection present, redirect to list
        this.navigateBack();
      }
    });
  }

  onSubmit(): void {
    const newStateId = this.formGroup().value.statusId;
    const students = this.selected();
    if (newStateId) {
      this.save(students, newStateId);
    }
  }

  onCancel(): void {
    this.navigateBack();
  }

  private createFormGroup(currentStateId: Option<number>) {
    return this.fb.group({
      statusId: [currentStateId],
    });
  }

  private loadAvailableStatus(): Observable<ReadonlyArray<StudyCourseStatus>> {
    return toObservable(this.currentStatus).pipe(
      switchMap((currentState) =>
        this.loadingService.load(
          this.studyCourseStatusService.getAvailableStatus(currentState),
        ),
      ),
    );
  }

  private save(
    students: ReadonlyArray<StudentEntry>,
    newStateId: number,
  ): void {
    this.saving.set(true);
    this.studyCourseStatusService
      .bulkUpdateStatus(students, newStateId)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.stateService.reload();
    this.toastService.success(
      this.translate.instant("events-students.study-course-edit.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    // TODO: pass returnlink (or maybe better handle it in the state service)
    void this.router.navigate(["../"], { relativeTo: this.route });
  }
}
