import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-edit',
  templateUrl: './tests-edit.component.html',
  styleUrls: ['./tests-edit.component.scss'],
})
export class TestsEditComponent {
  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  private testId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('testId')))
  );
  private tests$ = this.courseId$.pipe(
    switchMap((id) => this.state.getCourse(id)),
    map((course) => course.Tests ?? [])
  );
  test$ = combineLatest([this.tests$, this.testId$]).pipe(
    map(([tests, id]) => tests.find((t) => t.Id === id))
  );

  constructor(private state: TestStateService, private route: ActivatedRoute) {}
}
