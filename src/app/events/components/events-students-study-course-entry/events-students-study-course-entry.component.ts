import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { StudentEntry } from "../../services/events-students-state.service";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";

@Component({
  selector: "bkd-events-students-study-course-entry",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-study-course-entry.component.html",
  styleUrl: "./events-students-study-course-entry.component.scss",
})
export class EventsStudentsStudyCourseEntryComponent {
  entry = input.required<StudentEntry>();
  returnLink = input<Option<string>>(null);
  selected = input.required<boolean>();

  toggleSelected = output<StudentEntry>();

  name = computed<string>(
    () => `${this.entry().firstName} ${this.entry().lastName}`,
  );
  link = computed<RouterLink["routerLink"]>(() => [
    "student",
    this.entry().id,
    "absences",
  ]);
  linkParams = computed<Params>(() => {
    const returnlink = this.returnLink();
    return returnlink
      ? {
          returnparams: new URLSearchParams({ returnlink }).toString(),
        }
      : {};
  });

  constructor(public selectionService: StudyCourseSelectionService) {}

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }
}
