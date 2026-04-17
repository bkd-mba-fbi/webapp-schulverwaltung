import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentWithClassRegistration } from "src/app/shared/models/student.model";
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
  studentId = input.required<number>();
  student = input<StudentWithClassRegistration>();
  returnParams = input.required<string>();

  dossierPages = STUDENT_PAGES;
}
