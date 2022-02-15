import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'erz-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  courseId$: Observable<number> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  constructor(private route: ActivatedRoute) {}
}
