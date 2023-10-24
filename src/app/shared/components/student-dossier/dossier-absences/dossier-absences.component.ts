import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmAbsencesSelectionService } from '../../../services/confirm-absences-selection.service';
import { DossierStateService } from '../../../services/dossier-state.service';
import { PresenceTypesService } from '../../../services/presence-types.service';
import { StudentProfileAbsencesService } from '../../../services/student-profile-absences.service';

@Component({
  selector: 'erz-dossier-absences',
  templateUrl: './dossier-absences.component.html',
  styleUrls: ['./dossier-absences.component.scss'],
  providers: [StudentProfileAbsencesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.state.currentDossier$.next('absences');
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
