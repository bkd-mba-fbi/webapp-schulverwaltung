import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { PersonWithClassRegistration } from "src/app/shared/models/person.model";
import { StudentAvatarComponent } from "../student-avatar/student-avatar.component";
import { STUDENT_PAGES } from "../student-pages";

@Component({
  selector: "bkd-student-navigation",
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    StudentAvatarComponent,
  ],
  templateUrl: "./student-navigation.component.html",
  styleUrl: "./student-navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentNavigationComponent {
  readonly studentId = input.required<number>();
  readonly student = input<PersonWithClassRegistration>();
  readonly returnParams = input.required<string>();

  protected readonly dossierPages = STUDENT_PAGES;
}
