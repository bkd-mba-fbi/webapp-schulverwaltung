import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent implements OnInit {
  ownTests$: Observable<Maybe<ReadonlyArray<Test>>>;

  constructor(public state: TestStateService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.ownTests$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.state.getCourse(id);
      }),
      map((course) => course.Tests?.filter((test) => test.IsOwner))
    );
  }
}
