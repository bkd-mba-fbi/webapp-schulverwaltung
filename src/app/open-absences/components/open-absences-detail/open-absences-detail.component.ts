import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { OpenAbsencesService } from '../../services/open-absences.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

@Component({
  selector: 'erz-open-absences-detail',
  templateUrl: './open-absences-detail.component.html',
  styleUrls: ['./open-absences-detail.component.scss']
})
export class OpenAbsencesDetailComponent implements OnInit {
  absences$ = this.route.paramMap.pipe(
    switchMap(this.getAbsencesForParams.bind(this))
  );
  studentFullName$ = this.absences$.pipe(
    map(absences => (absences[0] && absences[0].StudentFullName) || null)
  );

  constructor(
    private route: ActivatedRoute,
    private openAbsencesService: OpenAbsencesService
  ) {}

  ngOnInit(): void {}

  toggleAll(checked: boolean): void {
    // TODO
    console.log('toggleAll', checked);
  }

  toggleAbsence(absence: LessonPresence, checked: boolean): void {
    // TODO
    console.log('toggleAbsence', absence, checked);
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
