import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ReportInfo } from "src/app/shared/services/reports.service";
import { StudentDossierFilterService } from "src/app/shared/services/student-dossier-filter.service";
import { StudentGradesService } from "src/app/shared/services/student-grades.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { BacklinkComponent } from "../../backlink/backlink.component";
import { StudentDossierActionsComponent } from "../student-dossier-actions/student-dossier-actions.component";
import { StudentGradesActionsComponent } from "../student-grades-actions/student-grades-actions.component";
import { StudentNavigationComponent } from "../student-navigation/student-navigation.component";

@Component({
  selector: "bkd-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BacklinkComponent,
    StudentNavigationComponent,
    RouterOutlet,
    TranslatePipe,
    StudentDossierActionsComponent,
    StudentGradesActionsComponent,
  ],
  providers: [
    StudentStateService,
    StudentGradesService,
    StudentDossierFilterService,
  ],
})
export class StudentComponent {
  private state = inject(StudentStateService);
  private dossierGradesService = inject(StudentGradesService);

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
