import { AsyncPipe, JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";

@Component({
  selector: "bkd-events-students-study-course-edit",
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: "./events-students-study-course-edit.component.html",
  styleUrl: "./events-students-study-course-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseEditComponent {
  selectedIds = toSignal(this.selectionService.selectedIds$, {
    initialValue: [],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public selectionService: StudyCourseSelectionService,
  ) {
    effect(() => {
      if (this.selectedIds().length === 0) {
        // No selection present, redirect to list
        void this.router.navigate(["../"], { relativeTo: this.route });
      }
    });
  }
}
