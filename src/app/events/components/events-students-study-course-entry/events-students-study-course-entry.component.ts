import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { StudentEntry } from "../../services/events-students-state.service";

@Component({
  selector: "bkd-events-students-study-course-entry",
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-study-course-entry.component.html",
  styleUrl: "./events-students-study-course-entry.component.scss",
})
export class EventsStudentsStudyCourseEntryComponent {
  entry = input.required<StudentEntry>();
  returnLink = input<Option<string>>(null);

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
}
