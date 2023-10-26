import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EditAbsencesStateService } from "../../services/edit-absences-state.service";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";

@Component({
  selector: "erz-edit-absences",
  templateUrl: "./edit-absences.component.html",
  styleUrls: ["./edit-absences.component.scss"],
  providers: [
    EditAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EditAbsencesStateService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesComponent {
  constructor(public state: EditAbsencesStateService) {}
}
