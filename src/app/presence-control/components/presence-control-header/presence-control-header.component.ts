import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ViewMode } from '../../services/presence-control-state.service';

interface ViewModeOption {
  viewMode: ViewMode;
  icon: string;
}

@Component({
  selector: 'erz-presence-control-header',
  templateUrl: './presence-control-header.component.html',
  styleUrls: ['./presence-control-header.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter }
  ] // TODO: move to (app-)module?
})
export class PresenceControlHeaderComponent implements OnInit {
  @Input() lesson: Lesson;
  @Input() hasPreviousLesson = false;
  @Input() hasNextLesson = false;
  @Input() presentCount: Option<number> = null;
  @Input() absentCount: Option<number> = null;
  @Input() lateCount: Option<number> = null;
  @Input() viewMode: ViewMode;
  @Input() selectDate: Date;

  @Output() previousLesson = new EventEmitter<void>();
  @Output() nextLesson = new EventEmitter<void>();
  @Output() selectDateChange = new EventEmitter<Date>();
  @Output() search = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  viewModeOptions: ReadonlyArray<ViewModeOption> = [
    { viewMode: ViewMode.List, icon: 'list' },
    { viewMode: ViewMode.Grid, icon: 'view_module' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
