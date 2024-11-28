import { AsyncPipe, DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { addDays, format, startOfDay, subDays } from "date-fns";
import uniqBy from "lodash-es/uniqBy";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { TeachersRestService } from "src/app/shared/services/teachers-rest.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { SafePipe } from "../../../shared/pipes/safe.pipe";
import { DashboardService } from "../../services/dashboard.service";
import {
  DashboardTimetableEntry,
  convertTimetableEntry,
  createStudyClassesMap,
  decorateStudyClasses,
} from "../../utils/dashboard-timetable-entry";
import { DashboardTimetableTableComponent } from "../dashboard-timetable-table/dashboard-timetable-table.component";

const CALENDAR_SUBSCRIBE_KEY = "cal";

@Component({
  selector: "bkd-dashboard-timetable",
  templateUrl: "./dashboard-timetable.component.html",
  styleUrls: ["./dashboard-timetable.component.scss"],
  standalone: true,
  imports: [
    DashboardTimetableTableComponent,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslateModule,
    SafePipe,
  ],
})
export class DashboardTimetableComponent {
  userId$ = this.dashboardService.userId$;
  isTeacher$ = this.dashboardService.hasLessonTeacherRole$;
  isStudent$ = this.dashboardService.hasStudentRole$;
  date$ = new BehaviorSubject(startOfDay(new Date()));
  loading$ = new BehaviorSubject(true);
  timetableEntries$ = this.loadTimetableEntries();

  constructor(
    private teachersService: TeachersRestService,
    private studentsService: StudentsRestService,
    private lessonPresencesService: LessonPresencesRestService,
    private userSettings: UserSettingsService,
    private dashboardService: DashboardService,
  ) {}

  gotoToday(): void {
    this.loading$.next(true);
    this.date$.next(startOfDay(new Date()));
  }

  gotoPreviousDay(): void {
    this.loading$.next(true);
    this.date$.next(subDays(this.date$.getValue(), 1));
  }

  gotoNextDay(): void {
    this.loading$.next(true);
    this.date$.next(addDays(this.date$.getValue(), 1));
  }

  getSubscribeCalendarUrl(): Observable<Option<string>> {
    return this.userSettings.getSetting(CALENDAR_SUBSCRIBE_KEY);
  }

  private loadTimetableEntries(): Observable<
    ReadonlyArray<DashboardTimetableEntry>
  > {
    return combineLatest([this.isTeacher$, this.isStudent$]).pipe(
      switchMap(([isTeacher, isStudent]) => {
        if (isTeacher) {
          return this.fetchTimetableEntries("teacher");
        } else if (isStudent) {
          return this.fetchTimetableEntries("student");
        }
        return of([]);
      }),
      tap(() => this.loading$.next(false)),
      shareReplay(1),
    );
  }

  private fetchTimetableEntries(
    userType: "teacher" | "student",
  ): Observable<ReadonlyArray<DashboardTimetableEntry>> {
    return combineLatest([this.userId$, this.date$]).pipe(
      switchMap(([userId, date]) => {
        const params: Dict<string> = {
          "filter.From": `=${format(date, "yyyy-MM-dd")}`,
          sort: "From,To",
        };
        return userType === "teacher"
          ? this.teachersService.getTimetableEntries(userId, params)
          : this.studentsService.getTimetableEntries(userId, params);
      }),
      map((entries) => entries.map(convertTimetableEntry)),
      map((entries) => uniqBy(entries, (entry) => entry.id)), // Due to a bug, the backend returns duplicate entries, so we filter them out here (this can be removed once fixed)
      switchMap((entries) => {
        if (userType === "teacher") {
          // Apparently the backend squashes the study classes of grouped
          // lessons with multiple classes and only provides it as part of the
          // `EventNumber`. As a workaround (to be able to display the classes
          // comma-separated) we fetch the study classes separately from the
          // lesson presences for now. This can be removed, once the classes are
          // provided on the timetable entries in a clean way.
          return this.loadStudyClasses().pipe(
            map((studyClasses) => decorateStudyClasses(entries, studyClasses)),
          );
        } else {
          // For students, the study classes are not used
          return of(entries);
        }
      }),
    );
  }

  private loadStudyClasses(): Observable<Dict<ReadonlyArray<string>>> {
    return this.date$.pipe(
      switchMap((date) =>
        this.lessonPresencesService.getLessonStudyClassesByDate(date),
      ),
      map(createStudyClassesMap),
    );
  }
}
