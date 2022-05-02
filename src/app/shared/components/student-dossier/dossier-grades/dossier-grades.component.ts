import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';

@Component({
  selector: 'erz-dossier-grades',
  templateUrl: './dossier-grades.component.html',
  styleUrls: ['./dossier-grades.component.scss'],
})
export class DossierGradesComponent implements OnInit, OnDestroy {
  constructor(
    private state: DossierStateService,
    public dossierGradesService: DossierGradesService
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.isOverview$.next(false);

    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => this.dossierGradesService.setStudentId(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
