import { AsyncPipe, NgIf } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BehaviorSubject, of, startWith, switchMap } from "rxjs";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { Course } from "../../../shared/models/course.model";
import { ReportsService } from "../../../shared/services/reports.service";

@Component({
  selector: "erz-tests-header",
  templateUrl: "./tests-header.component.html",
  styleUrls: ["./tests-header.component.scss"],
  standalone: true,
  imports: [
    BacklinkComponent,
    RouterLink,
    ReportsLinkComponent,
    NgIf,
    AsyncPipe,
    TranslateModule,
  ],
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
