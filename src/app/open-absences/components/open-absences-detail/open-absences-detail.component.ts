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
  allSelected$ = combineLatest(
    this.absences$,
    this.selectionService.selection$
  ).pipe(map(([absences, selection]) => absences.length === selection.length));

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private openAbsencesService: OpenAbsencesService,
    public selectionService: AbsencesSelectionService
  ) {}

  ngOnInit(): void {
    this.selectionService.selectedIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => (this.openAbsencesService.selected = ids));

    // Set detail params on service to be able to navigate back to
    // here after edit
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(
      params =>
        (this.openAbsencesService.currentDetail = {
          date: String(params.get('date')),
          personId: Number(params.get('personId'))
        })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.absences$
        .pipe(take(1))
        .subscribe(absences => this.selectionService.clear(absences));
    } else {
      this.selectionService.clear();
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
