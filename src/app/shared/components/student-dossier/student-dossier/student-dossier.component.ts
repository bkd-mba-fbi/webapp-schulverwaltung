import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { DossierStateService } from "../../../services/dossier-state.service";

@Component({
  selector: "erz-student-dossier",
  templateUrl: "./student-dossier.component.html",
  styleUrls: ["./student-dossier.component.scss"],
  providers: [DossierStateService, DossierGradesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierComponent {
  constructor(
    public state: DossierStateService,
    public dossierGradesService: DossierGradesService,
  ) {
    this.state.currentDossier$.next("addresses");
  }
}
