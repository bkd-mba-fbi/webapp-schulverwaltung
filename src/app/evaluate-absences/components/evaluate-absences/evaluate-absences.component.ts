import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {
  EvaluateAbsencesStateService,
  EvaluateAbsencesFilter
} from '../../services/evaluate-absences-state.service';
import { ActivatedRoute, Params } from '@angular/router';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'erz-evaluate-absences',
  templateUrl: './evaluate-absences.component.html',
  styleUrls: ['./evaluate-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EvaluateAbsencesStateService]
})
export class EvaluateAbsencesComponent implements OnInit {
  params$ = this.route.queryParams;
  filter$ = this.params$.pipe(map(createFilterFromParams));

  constructor(
    public state: EvaluateAbsencesStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filter$
      .pipe(take(1))
      .subscribe(filter => this.state.setFilter(filter));
  }
}

function createFilterFromParams(params: Params): EvaluateAbsencesFilter {
  return {
    student: params.student || null,
    moduleInstance: params.moduleInstance || null,
    studyClass: params.studyClass || null
  };
}
