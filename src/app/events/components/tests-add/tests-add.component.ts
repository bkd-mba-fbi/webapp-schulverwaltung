import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { spread } from 'lodash-es';
import { combineLatest, map, switchMap } from 'rxjs';
import { searchEntries } from 'src/app/shared/utils/search';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent {
  private course$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.state.getCourse(id);
    })
  );

  private tests$ = this.course$.pipe(
    map((course) =>
      course.Tests?.filter((test) => test.IsOwner).sort(
        (a, b) => b.Date.getTime() - a.Date.getTime()
      )
    )
  );

  filteredTests$ = combineLatest([this.tests$, this.state.search$]).pipe(
    map(spread(searchEntries))
  );

  constructor(public state: TestStateService, private route: ActivatedRoute) {}
}
