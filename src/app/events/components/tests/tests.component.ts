import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestStateService } from '../../services/test-state.service';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'erz-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
  providers: [TestStateService],
})
export class TestsComponent implements OnInit, OnDestroy {
  courseId$: Observable<number> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged(),
  );

  destroy$ = new Subject<void>();

  constructor(
    public state: TestStateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.courseId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((courseId) => this.state.setCourseId(courseId));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
