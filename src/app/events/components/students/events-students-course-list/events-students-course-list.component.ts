import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentEntry } from "../../../services/events-students-state.service";
import { EventsStudentsCourseEntryComponent } from "../events-students-course-entry/events-students-course-entry.component";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";

@Component({
  selector: "bkd-events-students-course-list",
  imports: [
    TranslatePipe,
    EventsStudentsHeaderComponent,
    EventsStudentsCourseEntryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-course-list.component.html",
  styleUrl: "./events-students-course-list.component.scss",
})
export class EventsStudentsCourseListComponent {
  readonly title = input.required<Option<string>>();
  readonly count = input.required<number>();
  readonly entries = input.required<ReadonlyArray<StudentEntry>>();
  readonly multipleStudyClasses = input(false);
  readonly returnLink = input<Option<string>>(null);

  readonly searchTerm = model<string>();
}
