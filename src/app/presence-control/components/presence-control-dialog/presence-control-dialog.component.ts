import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';

export interface LessonPresenceOption {
  lessonPresence: LessonPresence;
  selected: boolean;
}

@Component({
  selector: 'erz-presence-control-dialog-component',
  templateUrl: './presence-control-dialog.component.html'
})
export class PresenceControlDialogComponent implements OnInit {
  @Input() entry: PresenceControlEntry;
  @Input() blockLessonPresences: ReadonlyArray<LessonPresence>;
  lessonPresenceOptions = {};
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.lessonPresenceOptions = this.blockLessonPresences.map(lessonPresence =>
      this.createLessonPresenceOption(lessonPresence)
    );
  }

  createLessonPresenceOption(
    lessonPresence: LessonPresence
  ): LessonPresenceOption {
    return {
      lessonPresence,
      selected:
        lessonPresence.LessonRef.Id === this.entry.lessonPresence.LessonRef.Id
    };
  }
}
