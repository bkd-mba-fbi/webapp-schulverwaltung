import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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
import { DossierStateService } from "../../../services/dossier-state.service";
import { PresenceTypesService } from "../../../services/presence-types.service";
import { StudentProfileAbsencesService } from "../../../services/student-profile-absences.service";
import { StudentDossierAbsencesComponent } from "../student-dossier-absences/student-dossier-absences.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";

@Component({
  selector: "bkd-dossier-absences",
  templateUrl: "./dossier-absences.component.html",
  styleUrls: ["./dossier-absences.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentDossierEntryHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierAbsencesComponent,
    AsyncPipe,
    TranslatePipe,
  ],
  providers: [StudentProfileAbsencesService],
})
export class DossierAbsencesComponent implements OnInit, OnDestroy {
  private state = inject(DossierStateService);
  private presenceTypesService = inject(PresenceTypesService);
  absencesService = inject(StudentProfileAbsencesService);
  absencesSelectionService = inject(ConfirmAbsencesSelectionService);

  halfDayActive$ = this.presenceTypesService.halfDayActive$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((studentId) => this.absencesService.setStudentId(studentId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
