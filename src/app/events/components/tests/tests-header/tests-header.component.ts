import { AsyncPipe } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { distinctUntilChanged, map, startWith, switchMap } from "rxjs";
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
export class TestsHeaderComponent {
  private reportsService = inject(ReportsService);

  readonly course = input.required<Course>();

  readonly courseDesignation = computed(() =>
    getCourseDesignation(this.course()),
  );

  reports$ = toObservable(this.course).pipe(
    map((course) => course.Id),
    distinctUntilChanged(),
    switchMap((courseId) =>
      this.reportsService.getCourseTestsReports(courseId),
    ),
    startWith([]),
  );
}
