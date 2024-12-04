import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import uniq from "lodash-es/uniq";
import { Observable, of, switchMap } from "rxjs";
import { StatusProcess } from "src/app/shared/models/status-process.model";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";

@Component({
  selector: "bkd-events-students-study-course-edit",
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
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
  selectedStatuses = computed(() =>
    this.selected().map(({ status }) => status),
  );
  statusUnique = computed(() => uniq(this.selectedStatuses()).length === 1);
  possibleStates = toSignal(this.loadPossibleStates(), { initialValue: [] });
  saving = signal(false);

  formGroup = this.createFormGroup();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private statusProcessService: StatusProcessesRestService,
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

  private createFormGroup(): FormGroup {
    return this.fb.group({});
  }

  private loadPossibleStates(): Observable<ReadonlyArray<StatusProcess>> {
    return toObservable(this.selected).pipe(
      switchMap((selected) => {
        const statusId = selected[0]?.statusId;
        return statusId
          ? this.statusProcessService.getListByStatus(statusId)
          : of([]);
      }),
    );
  }
}
