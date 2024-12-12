import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { StudentEntry } from "../../services/events-students-state.service";
import { EventsStudentsCourseEntryComponent } from "../events-students-course-entry/events-students-course-entry.component";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";

@Component({
  selector: "bkd-events-students-course-list",
  standalone: true,
  imports: [
    TranslateModule,
    EventsStudentsHeaderComponent,
    EventsStudentsCourseEntryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-course-list.component.html",
  styleUrl: "./events-students-course-list.component.scss",
})
export class EventsStudentsCourseListComponent {
  title = input.required<Option<string>>();
  count = input.required<number>();
  entries = input.required<ReadonlyArray<StudentEntry>>();
  multipleStudyClasses = input(false);
  returnLink = input<Option<string>>(null);

  searchTerm = model<string>();
}
