import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, combineLatest, Subject } from 'rxjs';
import { switchMap, map, take, takeUntil } from 'rxjs/operators';

import { OpenAbsencesService } from '../../services/open-absences.service';
import { AbsencesSelectionService } from '../../services/absences-selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

@Component({
  selector: 'erz-open-absences-detail',
  templateUrl: './open-absences-detail.component.html',
  styleUrls: ['./open-absences-detail.component.scss'],
  providers: [AbsencesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenAbsencesDetailComponent implements OnInit, OnDestroy {
  absences$ = this.route.paramMap.pipe(
    switchMap(this.getAbsencesForParams.bind(this))
  );
  studentFullName$ = this.absences$.pipe(
    map(absences => (absences[0] && absences[0].StudentFullName) || null)
  );
  allSelected$ = combineLatest(this.absences$, this.selection.selection$).pipe(
    map(([absences, selection]) => absences.length === selection.length)
  );

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private openAbsencesService: OpenAbsencesService,
    private selection: AbsencesSelectionService
  ) {}

  ngOnInit(): void {
    this.selection.selectedIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => (this.openAbsencesService.selected = ids));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.absences$
        .pipe(take(1))
        .subscribe(absences => this.selection.clear(absences));
    } else {
      this.selection.clear();
    }
  }

  onRowClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  private getAbsencesForParams(
    params: ParamMap
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.openAbsencesService.getUnconfirmedAbsences(
      String(params.get('date')),
      Number(params.get('personId'))
    );
  }
}
