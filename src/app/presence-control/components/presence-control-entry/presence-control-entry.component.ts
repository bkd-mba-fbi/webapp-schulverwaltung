import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { BlockLessonSelectionService } from '../../services/block-lesson-selection.service';
import { ViewMode } from '../../services/presence-control-state.service';

@Component({
  selector: 'erz-presence-control-entry',
  templateUrl: './presence-control-entry.component.html',
  styleUrls: ['./presence-control-entry.component.scss'],
  providers: [BlockLessonSelectionService]
})
export class PresenceControlEntryComponent implements OnInit, OnChanges {
  @Input() entry: PresenceControlEntry;
  @Input() viewMode: ViewMode;

  @Output() togglePresenceType = new EventEmitter<PresenceControlEntry>();

  @HostBinding('class') get presenceCategory(): string {
    return this.entry.presenceCategory;
  }

  private studentId$ = new ReplaySubject<number>(1);

  constructor(
    private modalService: NgbModal,
    private selectionService: BlockLessonSelectionService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entry) {
      this.studentId$.next(
        changes.entry.currentValue.lessonPresence.StudentRef.Id
      );
    }
  }

  get presenceCategoryIcon(): string {
    switch (this.entry.presenceCategory) {
      case 'absent':
        return 'cancel';
      case 'late':
        return 'watch_later';
      default:
        return 'check_circle';
    }
  }

  get isListViewMode(): boolean {
    return this.viewMode === ViewMode.List;
  }

  updatePresenceType(dialog: any, entry: PresenceControlEntry): void {
    this.selectionService.toggle(entry.lessonPresence);
    if (entry.blockLessonPresences.length === 1) {
      this.togglePresenceType.emit(entry);
    } else {
      this.modalService
        .open(dialog, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          result => {
            if (result === 'save') {
              this.selectionService.selectedIds$
                .pipe(take(1))
                .subscribe(selectedIds => {
                  // TODO do not change the block lesson presences on the entry, emit object?
                  entry.blockLessonPresences = entry.blockLessonPresences.filter(
                    presence => selectedIds.includes(presence.LessonRef.Id)
                  );
                  this.togglePresenceType.emit(entry);
                });
            }
            if (result === 'cancel') {
              this.selectionService.clear();
            }
          },
          () => {
            this.selectionService.clear();
          }
        );
    }
  }
}
