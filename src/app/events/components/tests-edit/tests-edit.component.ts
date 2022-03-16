import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'erz-tests-edit',
  templateUrl: './tests-edit.component.html',
  styleUrls: ['./tests-edit.component.scss'],
})
export class TestsEditComponent {
  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  constructor(private route: ActivatedRoute) {}
}
