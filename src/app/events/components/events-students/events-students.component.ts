import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EventsStudentsStateService } from "../../services/events-students-state.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";

@Component({
  selector: "bkd-events-students",
  standalone: true,
  imports: [RouterOutlet],
  providers: [EventsStudentsStateService, StudyCourseSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<router-outlet></router-outlet>",
})
export class EventsStudentsComponent {}
