import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeAll,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { searchEntries } from 'src/app/shared/utils/search';
import { spread } from '../../../shared/utils/function';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import {
  PresenceControlStateService,
  VIEW_MODES,
  ViewMode,
} from '../../services/presence-control-state.service';
import { PresenceControlBlockLessonComponent } from '../presence-control-block-lesson/presence-control-block-lesson.component';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { parseISOLocalDate } from 'src/app/shared/utils/date';
import { PresenceControlIncidentComponent } from '../presence-control-incident/presence-control-incident.component';
import { PresenceTypesService } from '../../../shared/services/presence-types.service';
import {
  BaseProperty,
  UserSetting,
  ViewModeType,
} from 'src/app/shared/models/user-setting.model';
import { buildUserSetting } from 'src/spec-builders';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { decode } from 'src/app/shared/utils/decode';

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  search$ = new BehaviorSubject<string>('');
  entries$ = combineLatest([
    this.state.selectedPresenceControlEntries$,
    this.search$,
  ]).pipe(map(spread(searchEntries)), shareReplay(1));

  private destroy$ = new Subject();

  constructor(
    private settingsService: UserSettingsRestService,
    public state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService,
    private presenceTypesService: PresenceTypesService,
    private modalService: NgbModal,
    private scrollPosition: ScrollPositionService,
    private route: ActivatedRoute
  ) {
    this.state.viewMode$
      .pipe(
        distinctUntilChanged(),
        switchMap((v) => this.updateSavedViewMode(v))
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.restoreStateFromParams.bind(this));
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  doTogglePresenceType(
    entry: PresenceControlEntry,
    lessonPresences?: ReadonlyArray<LessonPresence>
  ): void {
    this.state
      .getNextPresenceType(entry)
      .subscribe((newPresenceType) =>
        this.lessonPresencesUpdateService.updatePresenceTypes(
          lessonPresences ? lessonPresences : [entry.lessonPresence],
          newPresenceType ? newPresenceType.Id : null
        )
      );
  }

  togglePresenceType(entry: PresenceControlEntry): void {
    this.state
      .getBlockLessonPresences(entry)
      .pipe(take(1))
      .subscribe((lessonPresences) => {
        if (lessonPresences.length === 1) {
          this.doTogglePresenceType(entry);
        } else {
          const modalRef = this.modalService.open(
            PresenceControlBlockLessonComponent
          );
          modalRef.componentInstance.entry = entry;
          modalRef.componentInstance.blockLessonPresences = lessonPresences;
          modalRef.result.then(
            (selectedPresences) => {
              if (selectedPresences) {
                this.doTogglePresenceType(entry, selectedPresences);
              }
            },
            () => {}
          );
        }
      });
  }

  updateIncident(entry: PresenceControlEntry, presenceTypeId: number): void {
    this.lessonPresencesUpdateService.updatePresenceTypes(
      [entry.lessonPresence],
      presenceTypeId
    );
  }

  changeIncident(entry: PresenceControlEntry): void {
    this.presenceTypesService.incidentTypes$.subscribe((incidentTypes) => {
      const modalRef = this.modalService.open(PresenceControlIncidentComponent);
      modalRef.componentInstance.incident =
        incidentTypes.find((type) => type.Id === entry.presenceType?.Id) ||
        null;
      modalRef.componentInstance.incidentTypes = incidentTypes;
      modalRef.result.then(
        (selectedIncident) => {
          this.updateIncident(entry, selectedIncident?.Id || null);
        },
        () => {}
      );
    });
  }

  private restoreStateFromParams(params: Params): void {
    if (params.date) {
      this.state.setDate(parseISOLocalDate(params.date));
    }

    const lessonId = String(params.lesson);
    if (lessonId) {
      this.state.lessons$.pipe(take(1)).subscribe((lessons) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson) {
          this.state.setLesson(lesson);
        }
      });
    }

    if (params.viewMode && VIEW_MODES.includes(params.viewMode)) {
      this.state.setViewMode(params.viewMode);
    } else {
      this.getSavedViewMode()
        .pipe(take(1))
        .subscribe((v) => {
          this.state.setViewMode(v);
        });
    }
  }

  private updateSavedViewMode(viewMode: ViewMode): Observable<any> {
    const propertyBody: ViewModeType = {
      presenceControl: viewMode,
    };
    const body: BaseProperty = {
      Key: 'presenceControlViewMode',
      Value: JSON.stringify(propertyBody),
    };
    const cst = Object.assign({}, buildUserSetting());
    cst.Settings.push(body);
    return this.settingsService.updateUserSettingsCst(cst);
  }

  private getSavedViewMode(): Observable<ViewMode> {
    return this.settingsService.getUserSettingsCst().pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'presenceControlViewMode'),
      first(),
      map((v) => JSON.parse(v.Value)),
      switchMap(decode(ViewModeType)),
      map((v) => this.getViewModeForString(v.presenceControl))
    );
  }

  private getViewModeForString(viewMode: string): ViewMode {
    if (viewMode === ViewMode.List) {
      return ViewMode.List;
    } else {
      return ViewMode.Grid; // default
    }
  }
}
