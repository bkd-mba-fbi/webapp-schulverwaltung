import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ViewMode } from '../../services/presence-control-state.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() search = '';

  @Output() previousLesson = new EventEmitter<void>();
  @Output() nextLesson = new EventEmitter<void>();
  @Output() selectDateChange = new EventEmitter<Date>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  viewModeOptions: ReadonlyArray<ViewModeOption> = [
    { viewMode: ViewMode.List, icon: 'list' },
    { viewMode: ViewMode.Grid, icon: 'view_module' }
  ];

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  selectNextLesson(): void {
    if (this.hasNextLesson) {
      this.nextLesson.emit();
    } else {
      this.toastr.warning(
        this.translate.instant('presence-control.header.no-previous-lesson')
      );
    }
  }

  selectPreviousLesson(): void {
    if (this.hasPreviousLesson) {
      this.previousLesson.emit();
    } else {
      this.toastr.warning(
        this.translate.instant('presence-control.header.no-next-lesson')
      );
    }
  }
}
