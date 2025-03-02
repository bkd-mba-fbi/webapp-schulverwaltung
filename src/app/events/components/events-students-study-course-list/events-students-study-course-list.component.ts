import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { SortableHeaderComponent } from "../../../shared/components/sortable-header/sortable-header.component";
import { StudentEntry } from "../../services/events-students-state.service";
import { PrimarySortKey } from "../../services/events-students-state.service";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";
import { EventsStudentsStudyCourseEntryComponent } from "../events-students-study-course-entry/events-students-study-course-entry.component";

@Component({
  selector: "bkd-events-students-study-course-list",
  imports: [
    TranslatePipe,
    EventsStudentsHeaderComponent,
    EventsStudentsStudyCourseEntryComponent,
    SortableHeaderComponent,
    NgClass,
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
  searchTerm = model<string>();
  sortCriteriaChange = output<SortCriteria<PrimarySortKey>>();

  updateSortCriteria(newCriteria: SortCriteria<PrimarySortKey>): void {
    this.sortCriteriaChange.emit(newCriteria);
  }
}
