import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentDossierComponent } from "src/app/shared/components/student/student-dossier/student-dossier.component";
import { StudentStateService } from "src/app/shared/services/student-state.service";

@Component({
  selector: "bkd-my-dossier",
  imports: [TranslatePipe, StudentDossierComponent],
  providers: [StudentStateService],
  templateUrl: "./my-dossier.component.html",
  styleUrl: "./my-dossier.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDossierComponent {}
