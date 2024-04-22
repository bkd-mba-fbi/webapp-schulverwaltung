import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { MyAbsencesService } from "../../services/my-absences.service";

@Component({
  selector: "bkd-my-absences",
  templateUrl: "./my-absences.component.html",
  styleUrls: ["./my-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  providers: [MyAbsencesService, ConfirmAbsencesSelectionService],
})
export class MyAbsencesComponent {
  constructor() {}
}
