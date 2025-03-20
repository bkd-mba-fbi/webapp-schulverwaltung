import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { ReportInfo } from "src/app/shared/services/reports.service";
import { DossierStateService } from "../../../services/dossier-state.service";
import { BacklinkComponent } from "../../backlink/backlink.component";
import { ReportsLinkComponent } from "../../reports-link/reports-link.component";
import { StudentDossierNavigationComponent } from "../student-dossier-navigation/student-dossier-navigation.component";

@Component({
  selector: "bkd-student-dossier",
  templateUrl: "./student-dossier.component.html",
  styleUrls: ["./student-dossier.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BacklinkComponent,
    StudentDossierNavigationComponent,
    ReportsLinkComponent,
    RouterOutlet,
    TranslatePipe,
  ],
  providers: [DossierStateService, DossierGradesService],
})
export class StudentDossierComponent {
  private state = inject(DossierStateService);
  private dossierGradesService = inject(DossierGradesService);

  loading = toSignal(this.state.loadingStudent$, {
    requireSync: true,
  });
  studentId = toSignal(this.state.studentId$, { initialValue: null });
  student = toSignal(this.state.student$, { initialValue: null });

  dossierPage = this.state.dossierPage;
  reports = toSignal(this.dossierGradesService.testReports$, {
    initialValue: [] as ReadonlyArray<ReportInfo>,
  });

  backlinkQueryParams = toSignal(this.state.backlinkQueryParams$);
  returnParams = toSignal(this.state.returnParams$);
}
