import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentDossierActionsComponent } from "src/app/shared/components/student/student-dossier-actions/student-dossier-actions.component";
import { StudentDossierComponent } from "src/app/shared/components/student/student-dossier/student-dossier.component";
import { StudentDossierFilterService } from "src/app/shared/services/student-dossier-filter.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";

@Component({
  selector: "bkd-my-dossier",
  imports: [
    TranslatePipe,
    StudentDossierComponent,
    StudentDossierActionsComponent,
  ],
  providers: [StudentStateService, StudentDossierFilterService],
  templateUrl: "./my-dossier.component.html",
  styleUrl: "./my-dossier.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDossierComponent {}
