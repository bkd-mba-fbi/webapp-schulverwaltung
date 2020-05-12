import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';

interface LessonPresenceOption {
  lessonPresence: LessonPresence;
  selected: boolean;
}

@Component({
  selector: 'erz-presence-control-dialog-component',
  templateUrl: './presence-control-dialog.component.html',
})
export class PresenceControlDialogComponent implements OnInit {
  @Input() entry: PresenceControlEntry;
  @Input() blockLessonPresences: ReadonlyArray<LessonPresence>;
  lessonPresenceOptions: ReadonlyArray<LessonPresenceOption> = [];
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.lessonPresenceOptions = this.blockLessonPresences.map(
      (lessonPresence) => this.createLessonPresenceOption(lessonPresence)
    );
  }

  getSelectedLessonPresences(): ReadonlyArray<LessonPresence> {
    return this.lessonPresenceOptions
      .filter((option: LessonPresenceOption) => option.selected)
      .map((option: LessonPresenceOption) => option.lessonPresence);
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
