import { AsyncPipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";
import { LetDirective } from "../../../directives/let.directive";
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
  standalone: true,
  imports: [
    LetDirective,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentDossierEntryHeaderComponent,
    NgIf,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierAbsencesComponent,
    AsyncPipe,
    TranslateModule,
  ],
  providers: [StudentProfileAbsencesService],
})
export class DossierAbsencesComponent implements OnInit, OnDestroy {
  halfDayActive$ = this.presenceTypesService.halfDayActive$;

  private destroy$ = new Subject<void>();

  constructor(
    private state: DossierStateService,
    private presenceTypesService: PresenceTypesService,
    public absencesService: StudentProfileAbsencesService,
    public absencesSelectionService: ConfirmAbsencesSelectionService,
  ) {
    this.state.currentDossier$.next("absences");
  }

  ngOnInit(): void {
    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((studentId) => this.absencesService.setStudentId(studentId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
