import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentWithClassRegistration } from "src/app/shared/models/student.model";
import { DOSSIER_PAGES } from "../dossier-route";
import { StudentDossierAvatarComponent } from "../student-dossier-avatar/student-dossier-avatar.component";

@Component({
  selector: "bkd-student-dossier-navigation",
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    StudentDossierAvatarComponent,
  ],
  templateUrl: "./student-dossier-navigation.component.html",
  styleUrl: "./student-dossier-navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierNavigationComponent {
  studentId = input.required<number>();
  student = input<StudentWithClassRegistration>();
  returnParams = input.required<string>();

  dossierPages = DOSSIER_PAGES;
}
