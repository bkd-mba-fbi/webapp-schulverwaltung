import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { OpenAbsencesService } from '../../services/open-absences.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { isTruthy, longerOrEqual } from 'src/app/shared/utils/filter';
import { not } from 'fp-ts/lib/function';
import { PresenceTypesService } from '../../../shared/services/presence-types.service';
import { PersonsRestService } from '../../../shared/services/persons-rest.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../../shared/services/i18n.service';
import { getLanguagePrefix } from '../../../shared/utils/persons';

@Component({
  selector: 'erz-open-absences-detail',
  templateUrl: './open-absences-detail.component.html',
  styleUrls: ['./open-absences-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenAbsencesDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  absences$ = this.route.paramMap.pipe(
    switchMap(this.getAbsencesForParams.bind(this))
  );
  hasAbsences$ = this.absences$.pipe(map(longerOrEqual(1)));
  studentFullName$ = this.absences$.pipe(
    map((absences) => (absences[0] && absences[0].StudentFullName) || null)
  );
  allSelected$ = combineLatest([
    this.absences$,
    this.selectionService.selection$,
  ]).pipe(map(([absences, selection]) => absences.length === selection.length));

  studentEmail$ = this.absences$.pipe(
    map((absences) => (absences[0] && absences[0].StudentRef.Id) || null),
    switchMap((id) =>
      id ? this.personService.getByIdWithEmailInfos(id) : EMPTY
    )
  );
  translation$ = this.studentEmail$.pipe(
    switchMap((person) =>
      this.translate.getTranslation(
        this.i18n.getLocalizedLanguage(getLanguagePrefix(person))
      )
    )
  );
  allUnconfirmedAbsencesForStudent$ = this.route.paramMap.pipe(
    switchMap(this.getAbsencesForStudentParam.bind(this))
  );
  mailTo$ = combineLatest([
    this.studentEmail$,
    this.allUnconfirmedAbsencesForStudent$,
    this.translation$,
  ]).pipe(
    map(([email, absences, translation]) =>
      this.openAbsencesService.buildMailToString(email, absences, translation)
    )
  );

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private openAbsencesService: OpenAbsencesService,
    private presenceTypesService: PresenceTypesService,
    private personService: PersonsRestService,
    public selectionService: ConfirmAbsencesSelectionService,
    private scrollPosition: ScrollPositionService,
    private translate: TranslateService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.selectionService.clearNonLessonPresences();

    // Set detail params on service to be able to navigate back to
    // here after edit
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(
      (params) =>
        (this.openAbsencesService.currentDetail = {
          date: String(params.get('date')),
          personId: Number(params.get('personId')),
        })
    );

    // If there are no entries, return to main list
    this.hasAbsences$
      .pipe(takeUntil(this.destroy$), filter(not(isTruthy)))
      .subscribe(() => this.router.navigate(['/open-absences']));
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.absences$
        .pipe(take(1))
        .subscribe((absences) => this.selectionService.clear(absences));
    } else {
      this.selectionService.clear();
    }
  }

  onRowClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  getPresenceTypeDesignation(
    lessonPresence: LessonPresence
  ): Observable<Option<string>> {
    return this.presenceTypesService.displayedTypes$.pipe(
      map(
        (types) =>
          (lessonPresence.TypeRef.Id &&
            types.find((t) => t.Id === lessonPresence.TypeRef.Id)
              ?.Designation) ||
          null
      )
    );
  }

  private getAbsencesForParams(
    params: ParamMap
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.openAbsencesService.getUnconfirmedAbsences(
      String(params.get('date')),
      Number(params.get('personId'))
    );
  }

  private getAbsencesForStudentParam(
    params: ParamMap
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.openAbsencesService.getAllUnconfirmedAbsencesForStudent(
      Number(params.get('personId'))
    );
  }
}
