import {
  Component,
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
  NgbInputDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { LessonEntry } from '../../models/lesson-entry.model';
import { PresenceControlViewMode } from 'src/app/shared/models/user-settings.model';
import { Options } from '@popperjs/core';

/**
 * On small screens, the `.dropdown` element gets translated
 * negatively when the container is body. We monkey patch the lib to
 * avoid the dropdown to be placed off-screen. To avoid side-effects
 * in other contexts, we only do this for the lesson dropdown.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      /translate\(([0-9-.]+)px, ([0-9-.]+)px\)/,
    );
    if (matches && parseFloat(matches[1]) < 0) {
      container.style.transform = `translate(0px, ${matches[2]}px)`;
    }
  }

  // Return original return value
  return result;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

interface ViewModeOption {
  viewMode: PresenceControlViewMode;
  icon: string;
}

@Component({
  selector: 'erz-presence-control-header',
  templateUrl: './presence-control-header.component.html',
  styleUrls: ['./presence-control-header.component.scss'],
  providers: [
    NgbInputDatepickerConfig,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ], // TODO: move to (app-)module?
})
export class PresenceControlHeaderComponent {
  @Input() selectedLesson: LessonEntry;
  @Input() lessons: ReadonlyArray<LessonEntry>;
  @Input() presentCount: Option<number> = null;
  @Input() absentCount: Option<number> = null;
  @Input() unapprovedCount: Option<number> = null;
  @Input() absentPrecedingCount: Option<number> = null;
  @Input() viewMode: PresenceControlViewMode;
  @Input() selectDate: Date;
  @Input() search = '';

  @Output() selectLessonChange = new EventEmitter<LessonEntry>();
  @Output() selectDateChange = new EventEmitter<Date>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<PresenceControlViewMode>();

  @ViewChild(NgbDropdown) lessonDropdown?: NgbDropdown;

  viewModeOptions: ReadonlyArray<ViewModeOption> = [
    { viewMode: PresenceControlViewMode.List, icon: 'list' },
    { viewMode: PresenceControlViewMode.Grid, icon: 'view_module' },
  ];
  constructor(
    public state: PresenceControlStateService,
    config: NgbInputDatepickerConfig
  ) {
    // place datepicker popup in center of viewport
    config.popperOptions = (options: Partial<Options>) => {
      return {
        ...options,
        modifiers: options.modifiers?.map((modifier) => {
          if (modifier.name === 'offset') {
            modifier.options = {
              offset: ({ placement, reference, popper }: any) => {
                if (placement === 'bottom-start') {
                  return [
                    // popper coordinates are relative to the reference (positionTarget)
                    (window.innerWidth - popper.width) / 2 - reference.x,
                    0,
                  ];
                } else {
                  return [];
                }
              },
            };
          }
          return modifier;
        }),
      };
    };
  }
}
