import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  constructor(public state: TestStateService, private route: ActivatedRoute) {}
}
