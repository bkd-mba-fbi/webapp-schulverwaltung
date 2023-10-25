import { Component, Inject, Input } from '@angular/core';
import { Settings, SETTINGS } from 'src/app/settings';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardTimetableEntry } from '../dashboard-timetable/dashboard-timetable.component';

@Component({
  selector: 'erz-dashboard-timetable-table',
  templateUrl: './dashboard-timetable-table.component.html',
  styleUrls: ['./dashboard-timetable-table.component.scss'],
})
export class DashboardTimetableTableComponent {
  @Input()
  entries: ReadonlyArray<DashboardTimetableEntry> = [];

  isStudent$ = this.dashboardService.hasStudentRole$;
  isTeacher$ = this.dashboardService.hasLessonTeacherRole$;

  constructor(
    private dashboardService: DashboardService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  buildLink(eventId: number): string {
    return this.settings.eventlist['eventdetail'].replace(
      ':id',
      String(eventId),
    );
  }
}
