import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbInputDatepicker,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Options } from "@popperjs/core";
import { map } from "rxjs";
import { PresenceControlViewMode } from "src/app/shared/models/user-settings.model";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { notNull } from "src/app/shared/utils/filter";
import { CaretComponent } from "../../../shared/components/caret/caret.component";
import { ResettableInputComponent } from "../../../shared/components/resettable-input/resettable-input.component";
import { LessonEntry } from "../../models/lesson-entry.model";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";
import { PresenceControlStateService } from "../../services/presence-control-state.service";

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
  if (this._anchor.nativeElement.id === "lesson-dropdown") {
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
  selector: "bkd-presence-control-header",
  templateUrl: "./presence-control-header.component.html",
  styleUrls: ["./presence-control-header.component.scss"],
  standalone: true,
  imports: [
    NgbInputDatepicker,
    FormsModule,
    NgIf,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    CaretComponent,
    ResettableInputComponent,
    NgClass,
    RouterLink,
    AsyncPipe,
    DatePipe,
    TranslateModule,
  ],
  providers: [
    NgbInputDatepickerConfig,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
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
  @Input() search = "";

  @Output() selectLessonChange = new EventEmitter<LessonEntry>();
  @Output() selectDateChange = new EventEmitter<Date>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<PresenceControlViewMode>();

  @ViewChild(NgbDropdown) lessonDropdown?: NgbDropdown;

  viewModeOptions: ReadonlyArray<ViewModeOption> = [
    { viewMode: PresenceControlViewMode.List, icon: "list" },
    { viewMode: PresenceControlViewMode.Grid, icon: "view_module" },
  ];

  isGroupSelected$ = this.groupService.group$.pipe(map(notNull));

  constructor(
    public state: PresenceControlStateService,
    private groupService: PresenceControlGroupService,
    config: NgbInputDatepickerConfig,
  ) {
    // place datepicker popup in center of viewport
    config.popperOptions = (options: Partial<Options>) => {
      return {
        ...options,
        modifiers: options.modifiers?.map((modifier) => {
          if (modifier.name === "offset") {
            modifier.options = {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              offset: ({ placement, reference, popper }: any) => {
                if (placement === "bottom-start") {
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
