import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent {
  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  constructor(private route: ActivatedRoute) {}
}
