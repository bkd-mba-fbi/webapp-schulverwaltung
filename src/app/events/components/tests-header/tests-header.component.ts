import { Component, Input } from '@angular/core';
import { Course } from '../../../shared/models/course.model';
import { ReportsService } from '../../../shared/services/reports.service';
import { EventsStateService } from '../../services/events-state.service';

@Component({
  selector: 'erz-tests-header',
  templateUrl: './tests-header.component.html',
  styleUrls: ['./tests-header.component.scss'],
})
export class TestsHeaderComponent {
  // TODO: Get course over state service
  @Input() course: Course;

  constructor(
    private reportsService: ReportsService,
    private eventsStateService: EventsStateService
  ) {}

  loadReportUrl(): string {
    return this.reportsService.getEventReportUrl(this.course.Id);
  }

  getDesignation() {
    return this.eventsStateService.getDesignation(this.course);
  }
}
