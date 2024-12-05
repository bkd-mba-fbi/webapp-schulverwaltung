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
import { TranslateModule } from "@ngx-translate/core";
import isEqual from "lodash-es/isEqual";
import uniq from "lodash-es/uniq";
import { Observable, filter, map, of, switchMap } from "rxjs";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";

type State = {
  id: number;
  name: string;
};

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
  isStateUnique = computed(
    () => uniq(this.selected().map(({ statusId }) => statusId)).length === 1,
  );
  currentState = computed<Option<State>>(() => {
    const current = this.selected()[0];
    return current?.statusId && current?.status
      ? { id: current.statusId, name: current.status }
      : null;
  });
  availableStates = toSignal(this.loadAvailableStates(), {
    initialValue: [],
  });
  isTerminalState = computed(() =>
    isEqual(this.availableStates(), [this.currentState()]),
  );

  formGroup = computed(() =>
    this.createFormGroup(this.currentState()?.id ?? null),
  );
  isDirty = toSignal(
    toObservable(this.formGroup).pipe(
      filter(Boolean),
      switchMap(({ valueChanges }) => valueChanges),
      map(({ stateId }) => stateId && stateId !== this.currentState()?.id),
    ),
  );

  loading = toSignal(this.loadingService.loading(), { initialValue: false });
  saving = signal(false);
  canSave = computed(
    () =>
      this.isStateUnique() &&
      !this.isTerminalState() &&
      !this.saving() &&
      this.isDirty(),
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private statusProcessService: StatusProcessesRestService,
    private loadingService: LoadingService,
    public selectionService: StudyCourseSelectionService,
  ) {
    effect(() => {
      if (this.selectedIds().length === 0) {
        // No selection present, redirect to list
        this.cancel();
      }
    });
  }

  onSubmit(): void {}

  cancel(): void {
    void this.router.navigate(["../"], { relativeTo: this.route });
  }

  private createFormGroup(currentStateId: Option<number>) {
    return this.fb.group({
      stateId: [currentStateId],
    });
  }

  private loadAvailableStates(): Observable<ReadonlyArray<State>> {
    return toObservable(this.currentState).pipe(
      switchMap((currentState) =>
        this.loadingService
          .load(
            currentState
              ? this.statusProcessService.getForwardByStatus(currentState.id)
              : of([]),
          )
          .pipe(
            map((statusProcesses) =>
              statusProcesses
                .filter(
                  // TODO: Should we really filter these "Hist." entries like this?
                  (statusProcess) => !statusProcess.Status.startsWith("Hist."),
                )
                .map((statusProcess) => ({
                  id: statusProcess.IdStatus,
                  name: statusProcess.Status,
                })),
            ),
            map((states) =>
              currentState ? [currentState, ...states] : states,
            ),
          ),
      ),
    );
  }
}
