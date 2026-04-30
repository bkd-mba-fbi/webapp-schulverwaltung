import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
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
export class PresenceControlComponent {}
