import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, shareReplay } from 'rxjs/operators';

import {
  EvaluateAbsencesStateService,
  EvaluateAbsencesFilter,
} from '../../services/evaluate-absences-state.service';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { PresenceTypesRestService } from '../../../shared/services/presence-types-rest.service';
import { SETTINGS, Settings } from '../../../settings';
import { isHalfDay } from '../../../presence-control/utils/presence-types';

interface Column {
  key: keyof LessonPresenceStatistic;
  label: string;
}

@Component({
  selector: 'erz-evaluate-absences-list',
  templateUrl: './evaluate-absences-list.component.html',
  styleUrls: ['./evaluate-absences-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluateAbsencesListComponent implements OnInit, AfterViewInit {
  presenceTypes$ = this.presenceTypesService.getList().pipe(shareReplay(1));

  columns: ReadonlyArray<Column> = [
    { key: 'StudentFullName', label: 'student' },
    { key: 'TotalAbsences', label: 'total' },
    { key: 'TotalAbsencesValidExcuse', label: 'valid-excuse' },
    { key: 'TotalAbsencesWithoutExcuse', label: 'without-excuse' },
    { key: 'TotalAbsencesUnconfirmed', label: 'unconfirmed' },
    { key: 'TotalIncidents', label: 'late' },
    { key: 'TotalHalfDays', label: 'halfday' },
  ];

  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));
  profileReturnParams$ = this.state.queryParams$;

  constructor(
    public state: EvaluateAbsencesStateService,
    private scrollPosition: ScrollPositionService,
    private route: ActivatedRoute,
    private presenceTypesService: PresenceTypesRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  ngOnInit(): void {
    this.filterFromParams$
      .pipe(take(1))
      .subscribe((filterValue) => this.state.setFilter(filterValue));

    // Remove Column TotalHalfDays if the corresponding PresenceType is inactive
    this.presenceTypes$
      .pipe(
        map((types) =>
          types.filter((t) => isHalfDay(t, this.settings) && t.Active)
        )
      )
      .subscribe((types) => {
        if (types.length === 0) {
          this.columns = this.columns.filter((c) => c.key !== 'TotalHalfDays');
        }
      });
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  onScroll(): void {
    this.state.nextPage();
  }

  getSortingChar$(column: Column): Observable<string> {
    return this.state.sorting$.pipe(
      map((sorting) => {
        if (sorting && column.key === sorting.key) {
          return sorting.ascending ? '↓' : '↑';
        }
        return '';
      })
    );
  }
}

function createFilterFromParams(params: Params): EvaluateAbsencesFilter {
  return {
    student: params.student ? Number(params.student) : null,
    educationalEvent: params.educationalEvent
      ? Number(params.educationalEvent)
      : null,
    studyClass: params.studyClass ? Number(params.studyClass) : null,
  };
}
