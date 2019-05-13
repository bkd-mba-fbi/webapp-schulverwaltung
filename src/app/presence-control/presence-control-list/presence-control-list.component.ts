import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { spreadTuple } from '../../shared/utils/function';
import { searchLessonPresences } from '../utils/lesson-presences';
import { PresenceControlStateService } from '../presence-control-state.service';

const MINIMAL_SEARCH_TERM_LENGTH = 3;

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlListComponent implements OnInit {
  search$ = new BehaviorSubject<string>('');
  private validSearch$ = this.search$.pipe(
    map(term => (term.length < MINIMAL_SEARCH_TERM_LENGTH ? '' : term)),
    distinctUntilChanged()
  );

  lessonPresences$ = combineLatest(
    this.state.selectedLessonPresences$,
    this.validSearch$
  ).pipe(map(spreadTuple(searchLessonPresences)));

  constructor(public state: PresenceControlStateService) {}

  ngOnInit(): void {}
}
