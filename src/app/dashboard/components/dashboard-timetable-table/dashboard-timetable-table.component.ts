import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { getEventsStudentsLink } from "src/app/events/utils/events-students";
import { convertLink } from "src/app/shared/utils/url";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardTimetableEntryGroup } from "../../utils/dashboard-timetable-entry";

@Component({
  selector: "bkd-dashboard-timetable-table",
  templateUrl: "./dashboard-timetable-table.component.html",
  styleUrls: ["./dashboard-timetable-table.component.scss"],
  imports: [AsyncPipe, DatePipe, TranslatePipe, RouterLink],
})
export class DashboardTimetableTableComponent {
  private dashboardService = inject(DashboardService);

  @Input()
  entries: ReadonlyArray<DashboardTimetableEntryGroup> = [];

  isStudent$ = this.dashboardService.hasStudentRole$;
  isTeacher$ = this.dashboardService.hasLessonTeacherRole$;

  buildLink(eventId: number) {
    return convertLink(getEventsStudentsLink(eventId, "/dashboard"));
  }
}
