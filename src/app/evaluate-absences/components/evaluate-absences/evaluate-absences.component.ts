import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";

@Component({
  selector: "erz-evaluate-absences",
  templateUrl: "./evaluate-absences.component.html",
  styleUrls: ["./evaluate-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EvaluateAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EvaluateAbsencesStateService,
    },
  ],
})
export class EvaluateAbsencesComponent {
  constructor(public state: EvaluateAbsencesStateService) {}
}
