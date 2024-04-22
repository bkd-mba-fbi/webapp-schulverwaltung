import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";
import { EditAbsencesStateService } from "../../services/edit-absences-state.service";

@Component({
  selector: "bkd-edit-absences",
  templateUrl: "./edit-absences.component.html",
  styleUrls: ["./edit-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  providers: [
    EditAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EditAbsencesStateService,
    },
    ConfirmAbsencesSelectionService,
  ],
})
export class EditAbsencesComponent {
  constructor(public state: EditAbsencesStateService) {}
}
