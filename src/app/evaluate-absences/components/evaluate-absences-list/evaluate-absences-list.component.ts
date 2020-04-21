import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';

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
export class EvaluateAbsencesListComponent implements OnInit {
  columns: ReadonlyArray<Column> = [
    { key: 'StudentFullName', label: 'student' },
    { key: 'TotalAbsences', label: 'total' },
    { key: 'TotalAbsencesValidExcuse', label: 'valid-excuse' },
    { key: 'TotalAbsencesWithoutExcuse', label: 'without-excuse' },
    { key: 'TotalAbsencesUnconfirmed', label: 'unconfirmed' },
    { key: 'TotalIncidents', label: 'late' },
    { key: 'TotalHalfDays', label: 'halfday' },
  ];

  constructor(public state: EvaluateAbsencesStateService) {}

  ngOnInit(): void {}

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
