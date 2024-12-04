import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import uniq from "lodash-es/uniq";
import { Observable } from "rxjs";
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
  statusUnique = computed(
    () =>
      uniq(this.selected().map(({ status }) => status || null)).length === 1,
  );
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
    // TODO
    return this.statusProcessService.getListByStatus(42);
  }
}
