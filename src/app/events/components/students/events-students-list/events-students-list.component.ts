import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { map } from "rxjs";
import { EventsStudentsStateService } from "src/app/events/services/events-students-state.service";
import { BacklinkComponent } from "src/app/shared/components/backlink/backlink.component";
import { ReportsLinkComponent } from "src/app/shared/components/reports-link/reports-link.component";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { EventsStudentsCourseListComponent } from "../events-students-course-list/events-students-course-list.component";
import { EventsStudentsStudyCourseListComponent } from "../events-students-study-course-list/events-students-study-course-list.component";

@Component({
  selector: "bkd-events-students-list",
  imports: [
    TranslatePipe,
    SpinnerComponent,
    BacklinkComponent,
    ReportsLinkComponent,
    EventsStudentsCourseListComponent,
    EventsStudentsStudyCourseListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-list.component.html",
  styleUrl: "./events-students-list.component.scss",
})
export class EventsStudentsListComponent {
  state = inject(EventsStudentsStateService);
  private route = inject(ActivatedRoute);

  returnLink = toSignal(
    this.route.queryParams.pipe(
      map(({ returnlink }) => {
        return returnlink ? decodeURIComponent(returnlink) : null;
      }),
    ),
  );
}
