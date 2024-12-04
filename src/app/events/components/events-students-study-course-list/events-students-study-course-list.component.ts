import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map } from "rxjs";
import { SortCriteria } from "../../../shared/utils/sort";
import {
  PrimarySortKey,
  StudentEntry,
} from "../../services/events-students-state.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";
import { EventsStudentsHeaderComponent } from "../events-students-header/events-students-header.component";
import { EventsStudentsStudyCourseEntryComponent } from "../events-students-study-course-entry/events-students-study-course-entry.component";

@Component({
  selector: "bkd-events-students-study-course-list",
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
    EventsStudentsHeaderComponent,
    EventsStudentsStudyCourseEntryComponent,
  ],
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

  selectionCount = toSignal(
    this.selectionService.selection$.pipe(map((selection) => selection.length)),
  );

  constructor(public selectionService: StudyCourseSelectionService) {
    effect(
      () => {
        this.searchTerm();
        this.selectionService.clear();
      },
      { allowSignalWrites: true },
    );
  }

  onToggleAll(checked: boolean): void {
    this.selectionService.clear(checked ? this.entries() : null);
  }

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  getSortDirectionCharacter(
    sortCriteria: SortCriteria<PrimarySortKey>,
  ): string {
    return sortCriteria.ascending ? "↓" : "↑";
  }
}
