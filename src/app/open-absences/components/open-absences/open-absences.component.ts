import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CONFIRM_ABSENCES_SERVICE } from "src/app/shared/tokens/confirm-absences-service";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { OpenAbsencesService } from "../../services/open-absences.service";

@Component({
  selector: "bkd-open-absences",
  templateUrl: "./open-absences.component.html",
  styleUrls: ["./open-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [
    OpenAbsencesService,
    ConfirmAbsencesSelectionService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: OpenAbsencesService,
    },
  ],
})
export class OpenAbsencesComponent {
  constructor() {}
}
