import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject, of, startWith, switchMap } from "rxjs";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { Course } from "../../../shared/models/course.model";
import { ReportsService } from "../../../shared/services/reports.service";

@Component({
  selector: "erz-tests-header",
  templateUrl: "./tests-header.component.html",
  styleUrls: ["./tests-header.component.scss"],
})
export class TestsHeaderComponent implements OnChanges {
  // TODO: Get course over state service
  @Input() course: Course;

  private course$ = new BehaviorSubject<Option<Course>>(null);
  reports$ = this.course$.pipe(
    switchMap((course) =>
      course ? this.reportsService.getCourseReports(this.course.Id) : of([]),
    ),
    startWith([]),
  );

  constructor(
    private reportsService: ReportsService,
    private eventsRestService: EventsRestService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.course) {
      this.course$.next(changes.course.currentValue);
    }
  }

  getDesignation() {
    return this.eventsRestService.getDesignation(this.course);
  }
}
