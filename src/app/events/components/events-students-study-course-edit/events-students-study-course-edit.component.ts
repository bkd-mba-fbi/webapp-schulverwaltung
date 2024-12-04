import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
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
  selectedIds = toSignal(this.selectionService.selectedIds$, {
    initialValue: [],
  });
  saving = signal(false);
  formGroup = this.createFormGroup();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
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
}
