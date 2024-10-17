import { AsyncPipe, DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { addDays, format, startOfDay, subDays } from "date-fns";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { uniqueLessons } from "src/app/presence-control/utils/lesson-entries";
import { Lesson } from "src/app/shared/models/lesson.model";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { SafePipe } from "../../../shared/pipes/safe.pipe";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardTimetableTableComponent } from "../dashboard-timetable-table/dashboard-timetable-table.component";

export type DashboardTimetableEntry = {
  id: number;
  from: Date;
  until: Date;
  eventId: number;
  subject: string;
  studyClass?: string;
  room?: string;
  teacher?: string;
};

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
  studentId$ = this.dashboardService.studentId$;
  isTeacher$ = this.dashboardService.hasLessonTeacherRole$;
  isStudent$ = this.dashboardService.hasStudentRole$;
  date$ = new BehaviorSubject(startOfDay(new Date()));
  loading$ = new BehaviorSubject(true);
  timetableEntries$ = this.loadTimetableEntries();

  constructor(
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
          return this.loadTeacherTimetableEntries();
        } else if (isStudent) {
          return this.loadStudentTimetableEntries();
        }
        return of([]);
      }),
      tap(() => this.loading$.next(false)),
    );
  }

  private loadTeacherTimetableEntries(): Observable<
    ReadonlyArray<DashboardTimetableEntry>
  > {
    return this.date$.pipe(
      switchMap((date) => this.lessonPresencesService.getLessonsByDate(date)),
      map(uniqueLessons),
      map((lessons) => lessons.map(this.convertLesson.bind(this))),
    );
  }

  private loadStudentTimetableEntries(): Observable<
    ReadonlyArray<DashboardTimetableEntry>
  > {
    return combineLatest([this.studentId$, this.date$]).pipe(
      switchMap(([studentId, date]) =>
        this.studentsService.getTimetableEntries(studentId, {
          "filter.From": `=${format(date, "yyyy-MM-dd")}`,
          sort: "From,To",
        }),
      ),
      map((entries) => entries.map(this.convertTimetableEntry.bind(this))),
    );
  }

  private convertLesson(lesson: Lesson): DashboardTimetableEntry {
    return {
      id: lesson.LessonRef.Id,
      from: lesson.LessonDateTimeFrom,
      until: lesson.LessonDateTimeTo,
      eventId: lesson.EventRef.Id,
      subject: lesson.EventDesignation,
      studyClass: lesson.StudyClassNumber,
    };
  }

  private convertTimetableEntry(
    entry: TimetableEntry,
  ): DashboardTimetableEntry {
    return {
      id: entry.Id,
      from: entry.From,
      until: entry.To,
      eventId: entry.EventId,
      subject: entry.EventDesignation,
      room: entry.EventLocation || undefined,
      teacher: entry.EventManagerInformation || undefined,
    };
  }
}
