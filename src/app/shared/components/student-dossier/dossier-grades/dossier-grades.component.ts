import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';

@Component({
  selector: 'erz-dossier-grades',
  templateUrl: './dossier-grades.component.html',
  styleUrls: ['./dossier-grades.component.scss'],
})
export class DossierGradesComponent implements OnInit, OnDestroy {
  constructor(public state: DossierStateService) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.studentId$.pipe(takeUntil(this.destroy$)).subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
