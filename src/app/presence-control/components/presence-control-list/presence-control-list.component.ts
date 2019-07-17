import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { searchEntries } from 'src/app/shared/utils/search';
import { spreadTuple } from '../../../shared/utils/function';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import {
  filterPreviouslyAbsentEntries,
  filterPreviouslyPresentEntries
} from '../../utils/presence-control-entries';

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlListComponent implements OnInit {
  search$ = new BehaviorSubject<string>('');
  entries$ = combineLatest(
    this.state.selectedPresenceControlEntries$,
    this.search$
  ).pipe(
    map(spreadTuple(searchEntries)),
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
    this.state.getNextPresenceType(entry).subscribe(newPresenceType =>
      this.lessonPresencesUpdateService.updatePresenceTypes(
        // TODO get selected block lesson presences from param
        entry.blockLessonPresences,
        newPresenceType ? newPresenceType.Id : null
      )
    );
  }
}
