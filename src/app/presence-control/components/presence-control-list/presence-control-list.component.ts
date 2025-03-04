import { AsyncPipe } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { map, shareReplay, take, takeUntil } from "rxjs/operators";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { LessonPresencesUpdateService } from "src/app/shared/services/lesson-presences-update.service";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { parseISOLocalDate } from "src/app/shared/utils/date";
import { searchEntries } from "src/app/shared/utils/search";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { PresenceTypesService } from "../../../shared/services/presence-types.service";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlBlockLessonService } from "../../services/presence-control-block-lesson.service";
import {
  PresenceControlStateService,
  VIEW_MODES,
} from "../../services/presence-control-state.service";
import { PresenceControlBlockLessonComponent } from "../presence-control-block-lesson/presence-control-block-lesson.component";
import { PresenceControlEntryComponent } from "../presence-control-entry/presence-control-entry.component";
import { PresenceControlHeaderComponent } from "../presence-control-header/presence-control-header.component";
import { PresenceControlIncidentComponent } from "../presence-control-incident/presence-control-incident.component";

const SEARCH_FIELDS: ReadonlyArray<keyof PresenceControlEntry> = [
  "studentFullName",
];

@Component({
  selector: "bkd-presence-control-list",
  templateUrl: "./presence-control-list.component.html",
  styleUrls: ["./presence-control-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PresenceControlHeaderComponent,
    PresenceControlEntryComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class PresenceControlListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  state = inject(PresenceControlStateService);
  private blockLessons = inject(PresenceControlBlockLessonService);
  private lessonPresencesUpdateService = inject(LessonPresencesUpdateService);
  private presenceTypesService = inject(PresenceTypesService);
  private modalService = inject(BkdModalService);
  private scrollPosition = inject(ScrollPositionService);
  private route = inject(ActivatedRoute);

  search$ = new BehaviorSubject<string>("");
  entries$ = combineLatest([
    this.state.presenceControlEntriesByGroup$,
    this.search$,
  ]).pipe(
    map(([entries, term]) => searchEntries(entries, SEARCH_FIELDS, term)),
    shareReplay(1),
  );

  private destroy$ = new Subject<void>();

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

  doTogglePresenceType(entries: ReadonlyArray<PresenceControlEntry>): void {
    entries.forEach((entry) =>
      this.state
        .getNextPresenceType(entry)
        .subscribe((newPresenceType) =>
          this.lessonPresencesUpdateService.updatePresenceType(
            entry,
            newPresenceType ? newPresenceType.Id : null,
          ),
        ),
    );
  }

  togglePresenceType(entry: PresenceControlEntry): void {
    this.blockLessons
      .getBlockLessonPresenceControlEntries(entry)
      .pipe(take(1))
      .subscribe(
        (presenceControlEntries: ReadonlyArray<PresenceControlEntry>) => {
          if (presenceControlEntries.length === 1) {
            // Use the refetched entry from `presenceControlEntries`
            // instead of `entry` when mutating, to make sure we base
            // the update on the newest data (that has possibly
            // changed since we last fetched `entry`)
            const refetchedEntry = presenceControlEntries[0];
            this.doTogglePresenceType([refetchedEntry]);
          } else {
            const modalRef = this.modalService.open(
              PresenceControlBlockLessonComponent,
            );
            modalRef.componentInstance.entry = entry;
            modalRef.componentInstance.blockPresenceControlEntries =
              presenceControlEntries;
            modalRef.result.then(
              (entries) => {
                if (entries) {
                  this.doTogglePresenceType(entries);
                }
              },
              () => {},
            );
          }
        },
      );
  }

  updateIncident(entry: PresenceControlEntry, presenceTypeId: number): void {
    this.lessonPresencesUpdateService.updatePresenceType(entry, presenceTypeId);
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
        () => {},
      );
    });
  }

  private restoreStateFromParams(params: Params): void {
    if (params["date"]) {
      this.state.setDate(parseISOLocalDate(params["date"]));
    }

    const lessonId = String(params["lesson"]);
    if (lessonId) {
      this.state.setLessonId(lessonId);
    }

    if (params["viewMode"] && VIEW_MODES.includes(params["viewMode"])) {
      this.state.setViewMode(params["viewMode"]);
    }
  }
}
