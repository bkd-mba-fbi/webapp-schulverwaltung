import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Test } from 'src/app/shared/models/test.model';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  courseId$: Observable<number> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  course$ = this.courseId$.pipe(switchMap((id) => this.state.getCourse(id)));

  tests$: Observable<Test[]> = this.course$.pipe(
    map((course) => course.Tests ?? [])
  );

  testOptions$ = this.tests$.pipe(
    map((test) =>
      test.map((test) => {
        return { Key: test.Id, Value: test.Designation };
      })
    )
  );

  // TODO: do I need to check wether the array of tests is empty?
  selectedTestId$ = this.tests$.pipe(map((tests) => tests[0]?.Id));

  constructor(public state: TestStateService, private route: ActivatedRoute) {}
}
