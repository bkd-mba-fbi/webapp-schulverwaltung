import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LessonPresencesUpdateService } from "src/app/shared/services/lesson-presences-update.service";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { PresenceControlBlockLessonService } from "../../services/presence-control-block-lesson.service";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";
import { PresenceControlStateService } from "../../services/presence-control-state.service";

@Component({
  selector: "bkd-presence-control",
  template: "<router-outlet></router-outlet>",
  styleUrls: ["./presence-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [
    PresenceControlStateService,
    PresenceControlBlockLessonService,
    PresenceControlGroupService,
    ConfirmAbsencesSelectionService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: PresenceControlStateService,
    },
  ],
})
export class PresenceControlComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService,
  ) {}

  ngOnInit(): void {
    // Wire-up the state and update services to reflect changes in the
    // currently loaded data
    this.lessonPresencesUpdateService.stateUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((updates) => this.state.updateLessonPresencesTypes(updates));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
