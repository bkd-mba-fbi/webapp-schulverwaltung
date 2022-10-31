import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';

interface LessonPresenceOption {
  lessonPresence: LessonPresence;
  selected: boolean;
}

@Component({
  selector: 'erz-presence-control-block-lesson-component',
  templateUrl: './presence-control-block-lesson.component.html',
  styleUrls: ['presence-control-block-lesson.component.scss'],
})
export class PresenceControlBlockLessonComponent implements OnInit {
  @Input() entry: PresenceControlEntry;
  @Input() blockPresenceControlEntries: ReadonlyArray<PresenceControlEntry>;
  lessonPresenceOptions: ReadonlyArray<LessonPresenceOption> = [];
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.lessonPresenceOptions = this.blockPresenceControlEntries.map(
      (presenceControlEntry: PresenceControlEntry) =>
        this.createLessonPresenceOption(presenceControlEntry.lessonPresence)
    );
  }

  getSelectedEntries(): ReadonlyArray<PresenceControlEntry> {
    return this.blockPresenceControlEntries.filter(
      (entry: PresenceControlEntry) => {
        return this.lessonPresenceOptions
          .filter((option: LessonPresenceOption) => option.selected)
          .filter((option: LessonPresenceOption) => option.selected)
          .map((option: LessonPresenceOption) => {
            return entry.lessonPresence.Id == option.lessonPresence.Id;
          });
      }
    );
  }

  createLessonPresenceOption(
    lessonPresence: LessonPresence
  ): LessonPresenceOption {
    return {
      lessonPresence,
      selected: true,
    };
  }
}
