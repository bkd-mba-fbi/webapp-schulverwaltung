import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';

import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { searchEntries } from 'src/app/shared/utils/search';
import { spread } from '../../../shared/utils/function';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import {
  PresenceControlStateService,
  VIEW_MODES,
} from '../../services/presence-control-state.service';
import { PresenceControlBlockLessonComponent } from '../presence-control-block-lesson/presence-control-block-lesson.component';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { parseISOLocalDate } from 'src/app/shared/utils/date';
import { PresenceControlIncidentComponent } from '../presence-control-incident/presence-control-incident.component';
import { PresenceTypesService } from '../../../shared/services/presence-types.service';

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  search$ = new BehaviorSubject<string>('');
  entries$ = combineLatest([
    this.state.selectedPresenceControlEntriesByGroup$,
    this.search$,
  ]).pipe(map(spread(searchEntries)), shareReplay(1));

  private destroy$ = new Subject<void>();

  constructor(
    public state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService,
    private presenceTypesService: PresenceTypesService,
    private modalService: NgbModal,
    private scrollPosition: ScrollPositionService,
    private route: ActivatedRoute
  ) {}

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
    selectedPresenceControlEntries?: ReadonlyArray<PresenceControlEntry>
  ): void {
    this.state
      .getNextPresenceType(entry)
      .subscribe((newPresenceType) =>
        this.lessonPresencesUpdateService.updatePresenceTypes(
          selectedPresenceControlEntries
            ? selectedPresenceControlEntries
            : [entry],
          newPresenceType ? newPresenceType.Id : null
        )
      );
  }

  togglePresenceType(entry: PresenceControlEntry): void {
    this.state
      .getBlockLessonPresenceControlEntries(entry)
      .pipe(take(1))
      .subscribe(
        (presenceControlEntries: ReadonlyArray<PresenceControlEntry>) => {
          if (presenceControlEntries.length === 1) {
            this.doTogglePresenceType(entry);
          } else {
            const modalRef = this.modalService.open(
              PresenceControlBlockLessonComponent
            );
            modalRef.componentInstance.entry = entry;
            modalRef.componentInstance.blockPresenceControlEntries =
              presenceControlEntries;
            modalRef.result.then(
              (selectedPresenceControlEntries) => {
                if (selectedPresenceControlEntries) {
                  this.doTogglePresenceType(
                    entry,
                    selectedPresenceControlEntries
                  );
                }
              },
              () => {}
            );
          }
        }
      );
  }

  updateIncident(entry: PresenceControlEntry, presenceTypeId: number): void {
    this.lessonPresencesUpdateService.updatePresenceTypes(
      [entry],
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
    }
  }
}
