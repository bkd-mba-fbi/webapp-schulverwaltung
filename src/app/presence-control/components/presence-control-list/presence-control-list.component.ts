import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { searchEntries } from 'src/app/shared/utils/search';
import { spreadTuple } from '../../../shared/utils/function';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import {
  filterPreviouslyAbsentEntries,
  filterPreviouslyPresentEntries,
} from '../../utils/presence-control-entries';
import { PresenceControlDialogComponent } from '../presence-control-dialog/presence-control-dialog.component';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlListComponent implements OnInit, AfterViewInit {
  search$ = new BehaviorSubject<string>('');
  entries$ = combineLatest([
    this.state.selectedPresenceControlEntries$,
    this.search$,
  ]).pipe(map(spreadTuple(searchEntries)), shareReplay(1));

  previouslyPresentEntries$ = this.entries$.pipe(
    map(filterPreviouslyPresentEntries)
  );

  previouslyAbsentEntries$ = this.entries$.pipe(
    map(filterPreviouslyAbsentEntries)
  );

  constructor(
    public state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService,
    private modalService: NgbModal,
    private scrollPosition: ScrollPositionService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  doTogglePresenceType(
    entry: PresenceControlEntry,
    lessonPresences?: ReadonlyArray<LessonPresence>
  ): void {
    this.state
      .getNextPresenceType(entry)
      .subscribe((newPresenceType) =>
        this.lessonPresencesUpdateService.updatePresenceTypes(
          lessonPresences ? lessonPresences : [entry.lessonPresence],
          newPresenceType ? newPresenceType.Id : null
        )
      );
  }

  togglePresenceType(entry: PresenceControlEntry): void {
    this.state
      .getBlockLessonPresences(entry)
      .pipe(take(1))
      .subscribe((lessonPresences) => {
        if (lessonPresences.length === 1) {
          this.doTogglePresenceType(entry);
        } else {
          const modalRef = this.modalService.open(
            PresenceControlDialogComponent
          );
          modalRef.componentInstance.entry = entry;
          modalRef.componentInstance.blockLessonPresences = lessonPresences;
          modalRef.result.then(
            (selectedPresences) => {
              if (selectedPresences) {
                this.doTogglePresenceType(entry, selectedPresences);
              }
            },
            () => {}
          );
        }
      });
  }
}
