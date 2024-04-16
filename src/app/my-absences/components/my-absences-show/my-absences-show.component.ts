import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { flatten, uniq } from "lodash-es";
import { Observable, combineLatest, of } from "rxjs";
import { map, shareReplay, switchMap } from "rxjs/operators";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import {
  ReportInfo,
  ReportsService,
} from "src/app/shared/services/reports.service";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { StudentDossierAbsencesComponent } from "../../../shared/components/student-dossier/student-dossier-absences/student-dossier-absences.component";
import { StudentDossierEntryHeaderComponent } from "../../../shared/components/student-dossier/student-dossier-entry-header/student-dossier-entry-header.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { LessonAbsence } from "../../../shared/models/lesson-absence.model";
import { LessonIncident } from "../../../shared/models/lesson-incident.model";
import { MyAbsencesService } from "../../services/my-absences.service";
import { MyAbsencesReportLinkComponent } from "../my-absences-report-link/my-absences-report-link.component";

@Component({
  selector: "erz-my-absences-show",
  templateUrl: "./my-absences-show.component.html",
  styleUrls: ["./my-absences-show.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    ReportsLinkComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    MyAbsencesReportLinkComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierEntryHeaderComponent,
    NgIf,
    StudentDossierAbsencesComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MyAbsencesShowComponent {
  openAbsencesReports$ = this.loadOpenAbsencesReports();
  allAbsencesReports$ = this.loadAllAbsencesReports();

  constructor(
    private reportsService: ReportsService,
    public myAbsencesService: MyAbsencesService,
    public absencesSelectionService: ConfirmAbsencesSelectionService,
  ) {}

  private loadOpenAbsencesReports(): Observable<ReadonlyArray<ReportInfo>> {
    return combineLatest([
      this.absencesSelectionService.selectedWithoutPresenceType$,
      this.absencesSelectionService.selectedIds$,
    ]).pipe(
      switchMap(([selectedWithout, selectedIds]) =>
        selectedWithout.length === 0 && selectedIds.length > 0
          ? this.getOpenAbsencesRecordIds(
              uniq(flatten(selectedIds.map((s) => s.lessonIds))),
            )
          : of([]),
      ),
      switchMap((recordIds) =>
        this.reportsService.getStudentConfirmationReports(recordIds),
      ),
      shareReplay(1),
    );
  }

  private loadAllAbsencesReports(): Observable<ReadonlyArray<ReportInfo>> {
    return combineLatest([
      this.myAbsencesService.openLessonAbsences$,
      this.myAbsencesService.checkableLessonAbsences$,
      this.myAbsencesService.excusedLessonAbsences$,
      this.myAbsencesService.unexcusedLessonAbsences$,
      this.myAbsencesService.incidentsLessonAbsences$,
    ]).pipe(
      map(
        (
          absences: ReadonlyArray<
            ReadonlyArray<LessonAbsence | LessonIncident>
          >,
        ) => this.getAllAbsencesRecordIds(flatten(absences)),
      ),
      switchMap((recordIds) =>
        this.reportsService.getMyAbsencesReports(recordIds),
      ),
      shareReplay(1),
    );
  }

  private getAllAbsencesRecordIds(
    presences: ReadonlyArray<LessonAbsence | LessonIncident>,
  ): ReadonlyArray<string> {
    return presences.map((p) => `${p.LessonRef.Id}_${p.RegistrationId}`);
  }

  private getOpenAbsencesRecordIds(
    lessonIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<string>> {
    return this.myAbsencesService.openLessonAbsences$.pipe(
      map((absences) =>
        absences
          .filter((a) => lessonIds.includes(a.LessonRef.Id))
          .map((a) => `${a.LessonRef.Id}_${a.RegistrationId}`),
      ),
    );
  }
}
