import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { AvatarComponent } from "src/app/shared/components/avatar/avatar.component";
import { StudentEntry } from "../../services/events-students-state.service";

@Component({
  selector: "bkd-events-students-course-entry",
  imports: [RouterLink, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-course-entry.component.html",
  styleUrl: "./events-students-course-entry.component.scss",
})
export class EventsStudentsCourseEntryComponent {
  entry = input.required<StudentEntry>();
  multipleStudyClasses = input(false);
  returnLink = input<Option<string>>(null);

  link = computed<RouterLink["routerLink"]>(() => [
    "student",
    this.entry().id,
    "addresses",
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
