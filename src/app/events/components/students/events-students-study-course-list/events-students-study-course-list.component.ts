import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { SortableHeaderComponent } from "../../../../shared/components/sortable-header/sortable-header.component";
import { StudentEntry } from "../../../services/events-students-state.service";
import { SortKey } from "../../../services/events-students-state.service";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";
import { EventsStudentsStudyCourseEntryComponent } from "../events-students-study-course-entry/events-students-study-course-entry.component";

@Component({
  selector: "bkd-events-students-study-course-list",
  imports: [
    TranslatePipe,
    EventsStudentsHeaderComponent,
    EventsStudentsStudyCourseEntryComponent,
    SortableHeaderComponent,
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-study-course-list.component.html",
  styleUrl: "./events-students-study-course-list.component.scss",
})
export class EventsStudentsStudyCourseListComponent {
  readonly title = input.required<Option<string>>();
  readonly count = input.required<number>();
  readonly entries = input.required<ReadonlyArray<StudentEntry>>();
  readonly returnLink = input<Option<string>>(null);
  readonly sortCriteria = model.required<Option<SortCriteria<SortKey>>>();
  readonly searchTerm = model<string>();

  updateSortCriteria(newCriteria: SortCriteria<SortKey>): void {
    this.sortCriteria.set(newCriteria);
  }
}
