import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, shareReplay } from 'rxjs/operators';

import { spreadTuple } from '../../../shared/utils/function';
import {
  searchPresenceControlEntries,
  filterPreviouslyAbsentEntries,
  filterPreviouslyPresentEntries
} from '../../utils/presence-control-entries';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';

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

  entries$ = combineLatest(
    this.state.selectedPresenceControlEntries$,
    this.validSearch$
  ).pipe(
    map(spreadTuple(searchPresenceControlEntries)),
    shareReplay(1)
  );

  previouslyPresentEntries$ = this.entries$.pipe(
    map(filterPreviouslyPresentEntries)
  );

  previouslyAbsentEntries$ = this.entries$.pipe(
    map(filterPreviouslyAbsentEntries)
  );

  constructor(
    public state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService
  ) {}

  ngOnInit(): void {}

  togglePresenceType(entry: PresenceControlEntry): void {
    this.state
      .getNextPresenceType(entry)
      .subscribe(newPresenceType =>
        this.lessonPresencesUpdateService.updatePresenceTypes(
          [entry.lessonPresence],
          newPresenceType ? newPresenceType.Id : null
        )
      );
  }
}
