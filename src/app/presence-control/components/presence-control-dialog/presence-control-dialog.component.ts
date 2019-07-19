import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { BlockLessonSelectionService } from '../../services/block-lesson-selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

@Component({
  selector: 'erz-presence-control-dialog-component',
  templateUrl: './presence-control-dialog.component.html',
  providers: [BlockLessonSelectionService]
})
export class PresenceControlDialogComponent implements OnInit {
  @Input() entry: PresenceControlEntry;
  @Input() blockLessonPresences: ReadonlyArray<LessonPresence>;

  constructor(
    public activeModal: NgbActiveModal,
    public selectionService: BlockLessonSelectionService
  ) {}

  ngOnInit(): void {
    console.log(this.entry);
    console.log(this.entry.lessonPresence);
    console.log(this.blockLessonPresences);
    // TODO preselect current entry
    this.selectionService.toggle(this.entry.lessonPresence);
  }
}
