import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { LetDirective } from "../../../directives/let.directive";
import { DossierStateService } from "../../../services/dossier-state.service";
import { ReportsLinkComponent } from "../../reports-link/reports-link.component";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentBacklinkComponent } from "../student-backlink/student-backlink.component";

@Component({
  selector: "erz-student-dossier",
  templateUrl: "./student-dossier.component.html",
  styleUrls: ["./student-dossier.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    StudentBacklinkComponent,
    ReportsLinkComponent,
    NgFor,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
  ],
  providers: [DossierStateService, DossierGradesService],
})
export class StudentDossierComponent {
  constructor(
    public state: DossierStateService,
    public dossierGradesService: DossierGradesService,
  ) {
    this.state.currentDossier$.next("addresses");
  }
}
