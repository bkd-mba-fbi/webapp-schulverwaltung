import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";

@Component({
  selector: "bkd-evaluate-absences",
  templateUrl: "./evaluate-absences.component.html",
  styleUrls: ["./evaluate-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [
    EvaluateAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EvaluateAbsencesStateService,
    },
    ConfirmAbsencesSelectionService,
  ],
})
export class EvaluateAbsencesComponent {
  constructor(public state: EvaluateAbsencesStateService) {}
}
