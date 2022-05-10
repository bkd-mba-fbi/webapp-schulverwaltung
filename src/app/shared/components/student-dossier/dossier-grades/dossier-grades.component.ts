import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';

@Component({
  selector: 'erz-dossier-grades',
  templateUrl: './dossier-grades.component.html',
  styleUrls: ['./dossier-grades.component.scss'],
})
export class DossierGradesComponent implements OnInit, OnDestroy {
  constructor(
    public state: DossierStateService,
    public dossierGradesService: DossierGradesService
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.currentDossier$.next('grades');

    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => this.dossierGradesService.setStudentId(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
