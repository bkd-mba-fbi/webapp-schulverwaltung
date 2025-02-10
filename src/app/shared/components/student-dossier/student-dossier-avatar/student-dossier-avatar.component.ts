import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Student } from "src/app/shared/models/student.model";
import { AvatarComponent } from "../../avatar/avatar.component";

@Component({
  selector: "bkd-student-dossier-avatar",
  imports: [DatePipe, AvatarComponent],
  templateUrl: "./student-dossier-avatar.component.html",
  styleUrl: "./student-dossier-avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierAvatarComponent {
  studentId = input.required<number>();
  student = input<Student>();
}
