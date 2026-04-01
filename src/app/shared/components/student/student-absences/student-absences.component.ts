import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";
import { ConfirmAbsencesSelectionService } from "../../../services/confirm-absences-selection.service";
import { PresenceTypesService } from "../../../services/presence-types.service";
import { StudentAbsencesService } from "../../../services/student-absences.service";
import { StudentStateService } from "../../../services/student-state.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentAbsencesListComponent } from "../student-absences-list/student-absences-list.component";
import { StudentEntryHeaderComponent } from "../student-entry-header/student-entry-header.component";

@Component({
  selector: "bkd-student-absences",
  templateUrl: "./student-absences.component.html",
  styleUrls: ["./student-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    SpinnerComponent,
    StudentAbsencesListComponent,
    StudentEntryHeaderComponent,
    AsyncPipe,
    TranslatePipe,
  ],
  providers: [StudentAbsencesService],
})
export class StudentAbsencesComponent implements OnInit, OnDestroy {
  private state = inject(StudentStateService);
  private presenceTypesService = inject(PresenceTypesService);
  absencesService = inject(StudentAbsencesService);
  absencesSelectionService = inject(ConfirmAbsencesSelectionService);

  halfDayActive$ = this.presenceTypesService.halfDayActive$;
  absenceCounts = this.absencesService.counts$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((studentId) => this.absencesService.setStudentId(studentId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  hasAbsences = computed(() => {
    const counts = this.absenceCounts();
    if (!counts) return false;

    const hasNonNullCounts =
      counts.checkableAbsences != null ||
      counts.openAbsences != null ||
      counts.excusedAbsences != null ||
      counts.unexcusedAbsences != null ||
      counts.incidents != null ||
      counts.halfDays != null;

    const totalAbsences =
      (counts.checkableAbsences ?? 0) +
      (counts.openAbsences ?? 0) +
      (counts.excusedAbsences ?? 0) +
      (counts.unexcusedAbsences ?? 0) +
      (counts.incidents ?? 0) +
      (counts.halfDays ?? 0);

    return hasNonNullCounts && totalAbsences > 0;
  });
}
