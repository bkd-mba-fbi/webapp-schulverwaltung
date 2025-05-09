import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { TestStateService } from "../../../services/test-state.service";

@Component({
  selector: "bkd-tests",
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
  providers: [TestStateService],
  imports: [RouterOutlet],
})
export class TestsComponent implements OnInit, OnDestroy {
  state = inject(TestStateService);
  private route = inject(ActivatedRoute);

  courseId$: Observable<number> = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
    distinctUntilChanged(),
  );

  destroy$ = new Subject<void>();

  ngOnInit() {
    this.courseId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((courseId) => this.state.setCourseId(courseId));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
