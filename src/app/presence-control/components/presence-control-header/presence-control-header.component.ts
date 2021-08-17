import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDropdown,
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import {
  PresenceControlStateService,
  ViewMode,
} from '../../services/presence-control-state.service';
import { LessonEntry } from '../../models/lesson-entry.model';

/**
 * On small screens, the `.dropdown` element gets translated
 * negatively when the container is body. We monkey patch the lib to
 * avoid the dropdown to be placed off-screen. To avoid side-effects
 * in other contexts, we only do this for the lesson dropdown.
 */
const positionMenuOriginal = (NgbDropdown.prototype as any)._positionMenu;
(NgbDropdown.prototype as any)._positionMenu = function _positionMenuPatched(
  ...args: any[]
): any {
  // Call original implementation
  const result = positionMenuOriginal.apply(this, args);

  // Correct horizontal translation to 0 if is negative
  if (this._anchor.nativeElement.id === 'lesson-dropdown') {
    const container = this._bodyContainer || this._menu.nativeElement;
    const matches = container.style.transform?.match(
      /translate\(([0-9-\.]+)px, ([0-9-\.]+)px\)/
    );
    if (matches && parseFloat(matches[1]) < 0) {
      container.style.transform = `translate(0px, ${matches[2]}px)`;
    }
  }

  // Return original return value
  return result;
};

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
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ], // TODO: move to (app-)module?
})
export class PresenceControlHeaderComponent implements OnInit {
  @Input() selectedLesson: LessonEntry;
  @Input() lessons: ReadonlyArray<LessonEntry>;
  @Input() presentCount: Option<number> = null;
  @Input() absentCount: Option<number> = null;
  @Input() unapprovedCount: Option<number> = null;
  @Input() absentPrecedingCount: Option<number> = null;
  @Input() viewMode: ViewMode;
  @Input() selectDate: Date;
  @Input() search = '';

  @Output() selectLessonChange = new EventEmitter<LessonEntry>();
  @Output() selectDateChange = new EventEmitter<Date>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  @ViewChild(NgbDropdown) lessonDropdown?: NgbDropdown;

  viewModeOptions: ReadonlyArray<ViewModeOption> = [
    { viewMode: ViewMode.List, icon: 'list' },
    { viewMode: ViewMode.Grid, icon: 'view_module' },
  ];
  constructor(public state: PresenceControlStateService) {}

  ngOnInit(): void {}
}
