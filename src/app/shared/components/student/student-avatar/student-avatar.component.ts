import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { PersonWithClassRegistration } from "src/app/shared/models/person.model";
import { AvatarComponent } from "../../avatar/avatar.component";

@Component({
  selector: "bkd-student-avatar",
  imports: [DatePipe, AvatarComponent],
  templateUrl: "./student-avatar.component.html",
  styleUrl: "./student-avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAvatarComponent {
  studentId = input.required<number>();
  student = input<PersonWithClassRegistration>();

  studyClasses = computed(
    () =>
      this.student()
        ?.ClassRegistrations?.filter((reg) => reg.IsActive)
        ?.map((reg) => reg.NumberStudyClass) ?? [],
  );
  studyClassesLabel = computed(() => this.studyClasses().join(", ") ?? null);
}
