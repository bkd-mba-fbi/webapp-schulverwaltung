import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { StudyCoursesStateService } from "src/app/events/services/study-courses-state.service";

@Component({
  selector: "bkd-study-courses",
  imports: [RouterOutlet],
  templateUrl: "./study-courses.component.html",
  styleUrl: "./study-courses.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StudyCoursesStateService],
})
export class StudyCoursesComponent {}
