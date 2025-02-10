import { AsyncPipe, NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { Observable } from "rxjs";
import { map, shareReplay, switchMap, take } from "rxjs/operators";
import { LessonPresenceStatistic } from "src/app/shared/models/lesson-presence-statistic";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LessonPresence } from "../../../shared/models/lesson-presence.model";
import { LessonPresencesRestService } from "../../../shared/services/lesson-presences-rest.service";
import { PresenceTypesService } from "../../../shared/services/presence-types.service";
import {
  ReportInfo,
  ReportsService,
} from "../../../shared/services/reports.service";
import {
  EvaluateAbsencesFilter,
  EvaluateAbsencesStateService,
} from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesHeaderComponent } from "../evaluate-absences-header/evaluate-absences-header.component";

interface Column {
  key: keyof LessonPresenceStatistic;
  label: string;
}

@Component({
  selector: "bkd-evaluate-absences-list",
  templateUrl: "./evaluate-absences-list.component.html",
  styleUrls: ["./evaluate-absences-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EvaluateAbsencesHeaderComponent,
    ReportsLinkComponent,
    InfiniteScrollDirective,
    NgClass,
    NgbTooltip,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class EvaluateAbsencesListComponent implements OnInit, AfterViewInit {
  state = inject(EvaluateAbsencesStateService);
  private scrollPosition = inject(ScrollPositionService);
  private route = inject(ActivatedRoute);
  private presenceTypesService = inject(PresenceTypesService);
  private reportsService = inject(ReportsService);
  private lessonPresencesService = inject(LessonPresencesRestService);

  reports$ = this.loadReports();

  columns: ReadonlyArray<Column> = [
    { key: "StudentFullName", label: "student" },
    { key: "TotalAbsences", label: "total" },
    { key: "TotalAbsencesValidExcuse", label: "valid-excuse" },
    { key: "TotalAbsencesWithoutExcuse", label: "without-excuse" },
    { key: "TotalAbsencesUnconfirmed", label: "unconfirmed" },
    { key: "TotalAbsencesUnchecked", label: "unchecked" },
    { key: "TotalIncidents", label: "incident" },
  ];

  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));
  profileReturnParams$ = this.state.queryParamsString$;

  ngOnInit(): void {
    this.filterFromParams$
      .pipe(take(1))
      .subscribe((filterValue) => this.state.setFilter(filterValue));

    // Add Column TotalHalfDays if the corresponding PresenceType is active
    this.presenceTypesService.halfDayActive$.subscribe((halfDayActive) => {
      if (halfDayActive) {
        this.columns = [
          ...this.columns,
          { key: "TotalHalfDays", label: "halfday" },
        ];
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  onScroll(): void {
    this.state.nextPage();
  }

  private loadReports(): Observable<ReadonlyArray<ReportInfo>> {
    return this.state.validFilter$.pipe(
      switchMap((filter) => this.lessonPresencesService.getLessonRefs(filter)),
      switchMap((lessonPresences) =>
        lessonPresences.length > 0
          ? this.reportsService.getEvaluateAbsencesReports(
              this.getReportRecordIds(lessonPresences),
            )
          : [],
      ),
      shareReplay(1),
    );
  }

  private getReportRecordIds(
    presences: ReadonlyArray<LessonPresence>,
  ): ReadonlyArray<string> {
    return presences.map((p) => `${p.LessonRef.Id}_${p.RegistrationRef.Id}`);
  }
}

function createFilterFromParams(params: Params): EvaluateAbsencesFilter {
  return {
    student: params["student"] ? Number(params["student"]) : null,
    educationalEvent: params["educationalEvent"]
      ? Number(params["educationalEvent"])
      : null,
    studyClass: params["studyClass"] ? Number(params["studyClass"]) : null,
  };
}
