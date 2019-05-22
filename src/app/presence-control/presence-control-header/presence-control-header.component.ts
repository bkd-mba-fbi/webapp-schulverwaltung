import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lesson } from 'src/app/shared/models/lesson.model';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'erz-presence-control-header',
  templateUrl: './presence-control-header.component.html',
  styleUrls: ['./presence-control-header.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }] // TODO: move to (app-)module?
})
export class PresenceControlHeaderComponent implements OnInit {
  @Input() lesson: Lesson;
  @Input() hasPreviousLesson = false;
  @Input() hasNextLesson = false;
  @Input() presentCount: Option<number> = null;
  @Input() absentCount: Option<number> = null;
  @Input() lateCount: Option<number> = null;

  @Output() previousLesson = new EventEmitter<void>();
  @Output() nextLesson = new EventEmitter<void>();
  @Output() selectDate = new EventEmitter<Date>();
  @Output() search = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onDateSelect(date: NgbDateStruct): void {
    this.selectDate.emit(new Date(date.year, date.month, date.day));
  }
}
