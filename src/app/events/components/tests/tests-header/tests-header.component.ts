import { AsyncPipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from "rxjs";
import { BacklinkComponent } from "../../../../shared/components/backlink/backlink.component";
import { ReportsLinkComponent } from "../../../../shared/components/reports-link/reports-link.component";
import { Course } from "../../../../shared/models/course.model";
import { ReportsService } from "../../../../shared/services/reports.service";
import { getCourseDesignation } from "../../../utils/events";

@Component({
  selector: "bkd-tests-header",
  templateUrl: "./tests-header.component.html",
  styleUrls: ["./tests-header.component.scss"],
  imports: [
    BacklinkComponent,
    RouterLink,
    ReportsLinkComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class TestsHeaderComponent implements OnChanges {
  private reportsService = inject(ReportsService);

  // TODO: Get course over state service
  @Input() course: Course;

  private course$ = new BehaviorSubject<Option<Course>>(null);
  reports$ = this.course$.pipe(
    map((course) => course?.Id),
    distinctUntilChanged(),
    switchMap((courseId) =>
      courseId ? this.reportsService.getCourseTestsReports(courseId) : of([]),
    ),
    startWith([]),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["course"]) {
      this.course$.next(changes["course"].currentValue);
    }
  }

  getDesignation() {
    return getCourseDesignation(this.course);
  }
}
