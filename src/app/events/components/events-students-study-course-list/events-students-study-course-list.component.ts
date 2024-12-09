import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SortCriteria } from "../../../shared/utils/sort";
import {
  PrimarySortKey,
  StudentEntry,
} from "../../services/events-students-state.service";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";
import { EventsStudentsStudyCourseEntryComponent } from "../events-students-study-course-entry/events-students-study-course-entry.component";

@Component({
  selector: "bkd-events-students-study-course-list",
  standalone: true,
  imports: [
    TranslateModule,
    EventsStudentsHeaderComponent,
    EventsStudentsStudyCourseEntryComponent,
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-study-course-list.component.html",
  styleUrl: "./events-students-study-course-list.component.scss",
})
export class EventsStudentsStudyCourseListComponent {
  title = input.required<Option<string>>();
  count = input.required<number>();
  entries = input.required<ReadonlyArray<StudentEntry>>();
  returnLink = input<Option<string>>(null);
  sortCriteria = input.required<SortCriteria<PrimarySortKey>>();

  toggleSort = output<void>();

  searchTerm = model<string>();

  primarySortKey: PrimarySortKey = "name";

  getSortDirectionCharacter(
    sortCriteria: SortCriteria<PrimarySortKey>,
  ): string {
    return sortCriteria.ascending ? "↓" : "↑";
  }
}
