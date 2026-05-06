import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { map } from "rxjs";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { StudentDossierEditLinkComponent } from "../student-dossier-edit-link/student-dossier-edit-link.component";

@Component({
  selector: "bkd-student-dossier-entry-footer",
  imports: [StudentDossierEditLinkComponent, TranslatePipe, DatePipe],
  templateUrl: "./student-dossier-entry-footer.component.html",
  styleUrl: "./student-dossier-entry-footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryFooterComponent {
  private state = inject(StudentStateService);
  private storage = inject(StorageService);

  entry = input.required<StudentDossierEntry>();

  private studentId = toSignal(this.state.studentId$, { requireSync: true });
  studentName = toSignal(
    this.state.student$.pipe(map((student) => student?.FullName ?? null)),
    {
      initialValue: null,
    },
  );

  /**
   * Whether the current user is the student itself.
   */
  isStudent = computed(() => {
    const studentId = this.studentId();
    const userId = this.storage.getPayload()?.id_person ?? null;
    return userId ? studentId === Number(userId) : false;
  });
}
