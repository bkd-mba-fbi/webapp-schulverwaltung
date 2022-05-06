import { Component, Input } from '@angular/core';
import { Course } from '../../../shared/models/course.model';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'erz-tests-header',
  templateUrl: './tests-header.component.html',
  styleUrls: ['./tests-header.component.scss'],
})
export class TestsHeaderComponent {
  // TODO: Get course over state service
  @Input() course: Course;

  constructor(private reportsService: ReportsService) {}

  loadReportUrl(): string {
    return this.reportsService.getEventReportUrl(this.course.Id);
  }

  getDesignation() {
    return this.course.Designation + this.getClassDesignation();
  }

  private getClassDesignation() {
    return this.course.Classes ? `, ${this.course.Classes[0].Designation}` : '';
  }
}
