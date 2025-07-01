import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { flatten, groupBy } from "lodash-es";
import { Observable, combineLatest, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Report, ReportType, SETTINGS, Settings } from "src/app/settings";
import { AvailableReports } from "../models/report.model";
import { decode } from "../utils/decode";
import { StorageService } from "./storage.service";

export type ReportInfo = Report & { title: string; url: string };

/**
 * Reports are PDF or Excel documents that are served under a special
 * URL. They can be generated for a given set of records (the type of
 * the records is depending on the report). In the UI, we create a
 * link to the report URL including the access token as query param.
 *
 * Every report has an availability state (whether it's active for the
 * current tenant/user or not), that can be requested via an API
 * endpoint. The availability request must contain at least one record
 * ID. For the reports where this is required, we filter the configured
 * reports by their availability state.
 *
 * The report URLs look like this (where the report can be downloaded):
 *   /Files/{report format}/{report context}/{report id}
 *     ?ids={comma separated record ids to be included in the report}
 *     &token={access token}
 *
 * And the availability of reports can be requested via this endpoint:
 *   /{report format}/AvailableReports/{report context}
 *     ?ids=${report id}
 *     &keys={comma separated record ids (same as ?ids in the report url)}
 */
@Injectable({
  providedIn: "root",
})
export class ReportsService {
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);
  private http = inject(HttpClient);

  /**
   * Report "Stammblatt" with user's master data (used in my profile)
   */
  getPersonMasterDataReports(
    personId: number,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Person",
      this.settings.personMasterDataReports,
      [personId],
    );
  }

  /**
   * Report "Entschuldigungsformular" with open absences sign (used in
   * my absences by students)
   *
   * @param recordIds The record IDs are the string {LessonAbsences.LessonRef.Id}_{LessonAbsences.RegistrationId}
   */
  getStudentConfirmationReports(
    recordIds: ReadonlyArray<string>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Praesenzinformation",
      this.settings.studentConfirmationReports,
      recordIds,
    );
  }

  /**
   * Report "Auswertung der Absenzen" (used in evaluate absences by
   * teachers)
   */
  getEvaluateAbsencesReports(
    recordIds: ReadonlyArray<string>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Praesenzinformation",
      this.settings.evaluateAbsencesReports,
      recordIds,
    );
  }

  /**
   * Report "Auswertung der Absenzen" (used in my absences by
   * students)
   *
   * @param recordIds The record IDs are the string {LessonPresence.LessonRef.Id}_{LessonPresence.RegistrationRef.Id}
   */
  getMyAbsencesReports(
    recordIds: ReadonlyArray<string>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Praesenzinformation",
      this.settings.myAbsencesReports,
      recordIds,
    );
  }

  /**
   * Report "Tests" with grades of a course (used in events/tests by
   * teachers)
   *
   * @param courseId The ID of the course/event
   */
  getCourseTestsReports(
    courseId: number,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Anlass",
      this.settings.testsByCourseReports,
      [courseId],
    );
  }

  /**
   * Report "Auswertung der Bewertung"
   *
   * @param eventId The ID of the course/study class
   */
  getEvaluationReports(eventId: number): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports("Anlass", this.settings.evaluationReports, [
      eventId,
    ]);
  }

  /**
   * Report including grades of multiple courses for a single student
   * (used in events/tests by teachers)
   */
  getStudentSubscriptionGradesReports(
    subscriptionIds: ReadonlyArray<number>,
  ): ReadonlyArray<ReportInfo> {
    const reports = this.settings.testsBySubscriptionStudentReports;
    return reports.map((report, i) => {
      const url = this.getReportUrl(
        report.type,
        "Anmeldung",
        report.id,
        subscriptionIds,
      );
      return { ...report, title: `Report ${i + 1}`, url };
    });
  }

  /**
   * Report including grades of multiple courses for a single student
   * (used in events/tests by students)
   */
  getTeacherSubscriptionGradesReports(
    subscriptionIds: ReadonlyArray<number>,
  ): ReadonlyArray<ReportInfo> {
    const reports = this.settings.testsBySubscriptionTeacherReports;
    return reports.map((report, i) => {
      const url = this.getReportUrl(
        report.type,
        "Anmeldung",
        report.id,
        subscriptionIds,
      );
      return { ...report, title: `Report ${i + 1}`, url };
    });
  }

  getStudyClassStudentsReports(
    studyClassId: number,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Anlass",
      this.settings.studyClassStudentsReports,
      [studyClassId],
    );
  }

  getCourseStudentsReports(
    courseId: number,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return this.getAvailableReports(
      "Anlass",
      this.settings.courseStudentsReports,
      [courseId],
    );
  }

  private getAvailableReports(
    context: string,
    reports: ReadonlyArray<Report>,
    recordIds: ReadonlyArray<number | string>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    const groupedReports = groupBy(reports, (report) => report.type);

    const groupedAvailable$ = combineLatest(
      Object.keys(groupedReports).map((reportType) =>
        this.getAvailableReportsForType(
          reportType as ReportType,
          context,
          groupedReports[reportType].map(({ id }) => id),
          recordIds,
        ),
      ),
    );

    return this.mergeAvailableReports(groupedAvailable$, reports);
  }

  private getAvailableReportsForType(
    reportType: ReportType,
    context: string,
    reportIds: ReadonlyArray<number>,
    recordIds: ReadonlyArray<number | string>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    if (recordIds.length === 0) {
      return of([]);
    }

    return this.http
      .get<unknown>(
        this.getReportAvailabilityUrl(
          reportType,
          context,
          reportIds,
          recordIds,
        ),
      )
      .pipe(
        switchMap(decode(AvailableReports)),
        map((result) =>
          result
            ? result.map(({ Id, Title }) => ({
                type: reportType,
                id: Id,
                title: Title,
                url: this.getReportUrl(reportType, context, Id, recordIds),
              }))
            : [],
        ),
      );
  }

  private mergeAvailableReports(
    groupedResult$: Observable<ReadonlyArray<ReadonlyArray<ReportInfo>>>,
    configured: ReadonlyArray<Report>,
  ): Observable<ReadonlyArray<ReportInfo>> {
    return groupedResult$.pipe(
      map((grouped) => {
        const results = flatten(grouped);
        return configured.reduce((available, report) => {
          const result = results.find(({ id }) => id === report.id);
          if (result) {
            return [...available, result];
          }
          return available;
        }, [] as ReadonlyArray<ReportInfo>);
      }),
    );
  }

  private getReportUrl(
    reportType: ReportType,
    context: string,
    reportId: number,
    recordIds: ReadonlyArray<number | string>,
  ): string {
    const url = new URL(
      `${this.settings.apiUrl}/Files/${this.getReportTypePathPart(
        reportType,
      )}/${context}/${reportId}`,
    );

    url.searchParams.set("ids", recordIds.join(","));

    return url.toString();
  }

  private getReportAvailabilityUrl(
    reportType: ReportType,
    context: string,
    reportIds: number | ReadonlyArray<number>,
    recordIds: ReadonlyArray<number | string>,
  ): string {
    const url = new URL(
      `${this.settings.apiUrl}/${this.getReportTypePathPart(
        reportType,
      )}/AvailableReports/${context}`,
    );

    url.searchParams.set(
      "ids",
      Array.isArray(reportIds) ? reportIds.join(",") : String(reportIds),
    );
    url.searchParams.set("keys", recordIds.join(","));

    return url.toString();
  }

  private getReportTypePathPart(type: ReportType): string {
    return `${type[0].toUpperCase() + type.slice(1)}Reports`;
  }
}
